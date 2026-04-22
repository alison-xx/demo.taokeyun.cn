<?php

require_once __DIR__ . '/../Helpers/Database.php';
require_once __DIR__ . '/../Helpers/Response.php';
require_once __DIR__ . '/../Middleware/Auth.php';
require_once __DIR__ . '/../Models/User.php';
require_once __DIR__ . '/../Models/Session.php';
require_once __DIR__ . '/../Models/Models.php';

class ChatController
{
    private $sessionModel;
    private $messageModel;
    private $userModel;

    public function __construct()
    {
        $this->sessionModel = new SessionModel();
        $this->messageModel = new MessageModel();
        $this->userModel = new UserModel();
    }

    public function listSessions(): void
    {
        $user = AuthMiddleware::handle();
        if (!$user) return;

        $page = max(1, (int)($_GET['page'] ?? 1));
        $pageSize = min(50, max(10, (int)($_GET['page_size'] ?? 20)));

        $result = $this->sessionModel->listByUser($user['id'], $page, $pageSize);
        ResponseHelper::paginated($result['list'], $result['total'], $page, $pageSize);
    }

    public function createSession(): void
    {
        $user = AuthMiddleware::handle();
        if (!$user) return;

        $input = json_decode(file_get_contents('php://input'), true) ?? [];

        $sessionId = $this->sessionModel->create([
            'user_id' => $user['id'],
            'employee_id' => $input['employee_id'] ?? '',
            'employee_name' => $input['employee_name'] ?? '',
            'collaboration_mode' => $input['collaboration_mode'] ? 1 : 0,
            'selected_employees' => isset($input['selected_employees']) ? json_encode($input['selected_employees']) : null,
        ]);

        ResponseHelper::success(['session_id' => $sessionId], '会话创建成功');
    }

    public function getSessionMessages(): void
    {
        $user = AuthMiddleware::handle();
        if (!$user) return;

        $sessionId = (int)($_GET['session_id'] ?? 0);
        if (!$sessionId) {
            ResponseHelper::error('缺少会话ID');
            return;
        }

        $session = $this->sessionModel->findById($sessionId, $user['id']);
        if (!$session) {
            ResponseHelper::error('会话不存在');
            return;
        }

        $messages = $this->messageModel->listBySession($sessionId);

        ResponseHelper::success([
            'session' => $session,
            'messages' => $messages,
        ]);
    }

    public function sendMessage(): void
    {
        $user = AuthMiddleware::handle();
        if (!$user) return;

        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        $sessionId = (int)($input['session_id'] ?? 0);
        $content = trim($input['content'] ?? '');
        $model = $input['model'] ?? 'deepseek-chat';  // 获取模型参数

        if (!$sessionId || !$content) {
            ResponseHelper::error('参数不完整');
            return;
        }

        $session = $this->sessionModel->findById($sessionId, $user['id']);
        if (!$session) {
            ResponseHelper::error('会话不存在');
            return;
        }

        if (!$this->userModel->updateQuota($user['id'])) {
            ResponseHelper::error('对话配额已用完，请升级套餐', 403);
            return;
        }

        $db = Database::getInstance();
        try {
            $db->beginTransaction();

            $this->messageModel->create([
                'session_id' => $sessionId,
                'role' => 'user',
                'content' => $content,
                'created_at' => date('Y-m-d H:i:s'),
            ]);

            if (empty($session['title'])) {
                $title = mb_substr($content, 0, 30) . (mb_strlen($content) > 30 ? '...' : '');
                $this->sessionModel->updateTitle($sessionId, $title);
            }

            $this->sessionModel->incrementMessageCount($sessionId);

            // 传递model参数给callAI
            $aiResponse = $this->callAI($session, $content, $user, $model);

            error_log("Chat: AI response received, content length=" . strlen($aiResponse['content'] ?? ''));

            $messageId = $this->messageModel->create([
                'session_id' => $sessionId,
                'role' => 'assistant',
                'content' => $aiResponse['content'],
                'model_used' => $aiResponse['model'] ?? '',
                'token_count' => $aiResponse['tokens'] ?? 0,
                'metadata' => isset($aiResponse['follow_ups']) ? json_encode(['follow_ups' => $aiResponse['follow_ups']]) : null,
                'created_at' => date('Y-m-d H:i:s'),
            ]);

            error_log("Chat: Message saved to DB, message_id={$messageId}");

            $db->commit();

            error_log("Chat: Preparing success response to frontend");

            ResponseHelper::success([
                'message_id' => $messageId,
                'content' => $aiResponse['content'],
                'model' => $aiResponse['model'] ?? '',
                'tokens' => $aiResponse['tokens'] ?? 0,
                'follow_ups' => $aiResponse['follow_ups'] ?? [],
            ], '发送成功');

        } catch (Exception $e) {
            $db->rollback();
            error_log("Chat error: " . $e->getMessage());
            ResponseHelper::error('消息发送失败，请稍后重试', 500);
        }
    }

    private function callAI(array $session, string $content, array $user, string $model = 'deepseek-chat'): array
    {
        $config = require __DIR__ . '/../../config/app.php';

        // 模型名称映射：前端简短名称 → API完整名称
        $modelMap = [
            'deepseek' => 'deepseek-chat',
            'minimax' => 'abab6.5s-chat',
        ];
        $model = $modelMap[$model] ?? $model;

        $provider = strpos($model, 'minimax') !== false ? 'minimax' : 'deepseek';
        $apiConfig = $config['ai_providers'][$provider] ?? [];

        // 获取API Key：优先使用用户个人配置，否则使用系统默认配置
        $apiKey = $this->getUserApiKey($user['id'], $provider);

        if (!$apiKey) {
            // 用户未配置个人密钥，使用系统默认密钥
            $db = Database::getInstance();
            $configKey = $provider . '_api_key'; // deepseek_api_key, minimax_api_key, siliconflow_api_key
            $row = $db->fetchOne(
                "SELECT config_value FROM system_configs WHERE config_key = :key",
                ['key' => $configKey]
            );
            $apiKey = $row['config_value'] ?? ($apiConfig['api_key'] ?? '');

            if (!$apiKey) {
                error_log("No API key available for provider: {$provider}");
                return ['content' => '系统错误：未配置API密钥，请联系管理员', 'model' => '', 'tokens' => 0];
            }

            error_log("Using system default API key for provider: {$provider}");
        }

        $systemPrompt = "你是{$session['employee_name']}，一个专业的AI助手。";
        $messages = [
            ['role' => 'system', 'content' => $systemPrompt],
            ['role' => 'user', 'content' => $content],
        ];

        error_log("callAI: Calling {$provider} API with model={$model}, api_url=" . ($apiConfig['api_url'] ?? 'null'));
        error_log("callAI: API Key length=" . strlen($apiKey) . ", content length=" . strlen($content));

        $ch = curl_init($apiConfig['api_url']);
        curl_setopt_array($ch, [
            CURLOPT_POST => true,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER => [
                'Content-Type: application/json',
                'Authorization: Bearer ' . $apiKey,
            ],
            CURLOPT_TIMEOUT => 120,
            CURLOPT_POSTFIELDS => json_encode([
                'model' => $model,
                'messages' => $messages,
                'stream' => false,
                'temperature' => 0.7,
                'max_tokens' => 4096,
            ]),
        ]);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $curlError = curl_error($ch);
        curl_close($ch);

        error_log("callAI: API response HTTP={$httpCode}, response_length=" . strlen($response ?? '') . ", curl_error={$curlError}");

        if ($httpCode !== 200 || !$response) {
            error_log("AI API error: HTTP {$httpCode} - {$response}, curl_error={$curlError}");
            return ['content' => '抱歉，AI服务暂时不可用，请稍后重试。', 'model' => $model, 'tokens' => 0];
        }

        $data = json_decode($response, true);
        $text = $data['choices'][0]['message']['content'] ?? '';
        $usage = $data['usage'] ?? [];
        $tokens = ($usage['total_tokens'] ?? 0) + ($usage['totalTokens'] ?? 0);

        $followUps = [];
        if (preg_match_all('/【追问[：:]?\d*】(.+?)(?=【|$)/s', $text, $matches)) {
            $followUps = array_map('trim', array_slice($matches[1], 0, 4));
            $text = preg_replace('/【追问[：:]?\d*】.+$/s', '', $text);
        }

        return [
            'content' => trim($text),
            'model' => $model,
            'tokens' => $tokens,
            'follow_ups' => $followUps,
        ];
    }

    /**
     * 流式发送消息（SSE - Server Sent Events）
     * 实时推送AI生成的每个token
     */
    public function streamSendMessage(): void
    {
        $user = AuthMiddleware::handle();
        if (!$user) return;

        header('Content-Type: text/event-stream');
        header('Cache-Control: no-cache');
        header('Connection: keep-alive');
        header('X-Accel-Buffering: no');

        if (function_exists('ob_implicit_flush')) {
            ob_implicit_flush(true);
        }
        while (ob_get_level() > 0) {
            ob_end_clean();
        }

        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        $sessionId = (int)($input['session_id'] ?? 0);
        $content = trim($input['content'] ?? '');
        $model = $input['model'] ?? 'deepseek-chat';

        if (!$sessionId || !$content) {
            echo "data: " . json_encode(['error' => '参数不完整', 'done' => true]) . "\n\n";
            flush();
            return;
        }

        try {
            $session = $this->sessionModel->findById($sessionId, $user['id']);
            if (!$session) {
                echo "data: " . json_encode(['error' => '会话不存在', 'done' => true]) . "\n\n";
                flush();
                return;
            }

            $db = Database::getInstance();
            $db->beginTransaction();

            $this->messageModel->create([
                'session_id' => $sessionId,
                'role' => 'user',
                'content' => $content,
                'created_at' => date('Y-m-d H:i:s'),
            ]);

            if (empty($session['title'])) {
                $title = mb_substr($content, 0, 30) . (mb_strlen($content) > 30 ? '...' : '');
                $this->sessionModel->updateTitle($sessionId, $title);
            }

            $this->sessionModel->incrementMessageCount($sessionId);
            $db->commit();

            $this->streamCallAI($session, $content, $user, $model);

        } catch (Exception $e) {
            error_log("Stream Chat error: " . $e->getMessage());
            echo "data: " . json_encode(['error' => $e->getMessage(), 'done' => true]) . "\n\n";
            flush();
        }
    }

    private function streamCallAI(array $session, string $content, array $user, string $model): void
    {
        error_log("开始streamCallAI: session_id={$session['id']}, model={$model}, content_length=" . strlen($content));
        
        $config = require __DIR__ . '/../../config/app.php';

        $modelMap = ['deepseek' => 'deepseek-chat', 'minimax' => 'abab6.5s-chat'];
        $model = $modelMap[$model] ?? $model;

        $provider = strpos($model, 'minimax') !== false ? 'minimax' : 'deepseek';
        $apiConfig = $config['ai_providers'][$provider] ?? [];

        error_log("Provider: {$provider}, API URL: " . ($apiConfig['api_url'] ?? 'N/A'));

        $apiKey = $this->getUserApiKey($user['id'], $provider);
        if (!$apiKey) {
            $db = Database::getInstance();
            $row = $db->fetchOne("SELECT config_value FROM system_configs WHERE config_key = ?", [$provider . '_api_key']);
            $apiKey = $row['config_value'] ?? ($apiConfig['api_key'] ?? '');
        }

        error_log("API Key length: " . strlen($apiKey));

        if (!$apiKey) {
            error_log("未配置API密钥");
            echo "data: " . json_encode(['error' => '未配置API密钥', 'done' => true]) . "\n\n";
            flush();
            return;
        }

        $systemPrompt = "你是{$session['employee_name']}，一个专业的AI助手。";
        $postData = json_encode([
            'model' => $model,
            'messages' => [
                ['role' => 'system', 'content' => $systemPrompt],
                ['role' => 'user', 'content' => $content]
            ],
            'stream' => true,
            'temperature' => 0.7,
            'max_tokens' => 4096,
        ]);
        
        error_log("API请求数据长度: " . strlen($postData));
        error_log("API请求数据: " . substr($postData, 0, 500) . (strlen($postData) > 500 ? '...' : ''));

        $ch = curl_init($apiConfig['api_url']);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, false);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json',
            'Authorization: Bearer ' . $apiKey,
        ]);
        curl_setopt($ch, CURLOPT_TIMEOUT, 120);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);

        // 使用回调处理流式数据
        $fullText = '';  // 收集完整文本用于提取追问建议
        $sessionId = $session['id']; // 保存session_id到局部变量
        $controller = $this; // 创建$this的引用
        $doneReceived = false; // 标记是否收到[DONE]标记
        
        error_log("设置curl回调函数，session_id: {$sessionId}");
        
        curl_setopt($ch, CURLOPT_WRITEFUNCTION, function($ch, $data) use (&$fullText, $sessionId, $controller, &$doneReceived) {
            error_log("收到curl数据: " . strlen($data) . " 字节");
            
            $lines = explode("\n", $data);
            foreach ($lines as $line) {
                $line = trim($line);
                error_log("处理行: '{$line}'");
                
                if (strpos($line, 'data: ') === 0) {
                    $payload = substr($line, 6);
                    error_log("payload: '{$payload}'");
                    
                    if ($payload === '[DONE]') {
                        error_log("收到[DONE]标记，fullText长度: " . strlen($fullText));
                        $doneReceived = true;
                        
                        // 提取追问建议
                        $followUps = [];
                        if (preg_match_all('/【追问[：:]?\d*】(.+?)(?=【|$)/s', $fullText, $matches)) {
                            $followUps = array_map('trim', array_slice($matches[1], 0, 4));
                            $fullText = preg_replace('/【追问[：:]?\d*】.+$/s', '', $fullText);
                        }

                        // 保存AI回复到数据库
                        if (!empty(trim($fullText))) {
                            try {
                                error_log("开始保存AI消息，session_id: {$sessionId}, content_length: " . strlen(trim($fullText)));
                                error_log("AI回复内容: " . substr(trim($fullText), 0, 100) . (strlen(trim($fullText)) > 100 ? '...' : ''));
                                
                                $messageId = $controller->messageModel->create([
                                    'session_id' => $sessionId,
                                    'role' => 'assistant',
                                    'content' => trim($fullText),
                                    'created_at' => date('Y-m-d H:i:s'),
                                ]);
                                
                                error_log("保存AI消息成功，message_id: {$messageId}");
                            } catch (Exception $e) {
                                error_log("保存AI消息失败: " . $e->getMessage());
                                error_log("异常堆栈: " . $e->getTraceAsString());
                            }
                        } else {
                            error_log("AI回复内容为空，跳过保存");
                        }

                        echo "data: " . json_encode([
                            'done' => true,
                            'follow_ups' => $followUps
                        ]) . "\n\n";
                        flush();
                        return strlen($data);
                    }
                    
                    $jsonData = json_decode($payload, true);
                    if ($jsonData && isset($jsonData['choices'][0]['delta']['content'])) {
                        $token = $jsonData['choices'][0]['delta']['content'];
                        $fullText .= $token;  // 收集文本
                        error_log("收到token: '" . substr($token, 0, 50) . (strlen($token) > 50 ? '...' : '') . "'");
                        echo "data: " . json_encode(['token' => $token]) . "\n\n";
                        flush();
                    }
                }
            }
            return strlen($data);
        });

        curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $curlError = curl_error($ch);
        curl_close($ch);

        error_log("streamCallAI: API response HTTP={$httpCode}, curl_error={$curlError}, doneReceived={$doneReceived}");

        // 如果没有收到[DONE]标记但有完整文本，尝试保存
        if (!$doneReceived && !empty(trim($fullText))) {
            error_log("未收到[DONE]标记，但有完整文本，尝试保存AI回复");
            try {
                $messageId = $this->messageModel->create([
                    'session_id' => $session['id'],
                    'role' => 'assistant',
                    'content' => trim($fullText),
                    'created_at' => date('Y-m-d H:i:s'),
                ]);
                error_log("保存AI消息成功（未收到[DONE]标记），message_id: {$messageId}");
            } catch (Exception $e) {
                error_log("保存AI消息失败（未收到[DONE]标记）: " . $e->getMessage());
            }
        }

        if ($httpCode !== 200) {
            error_log("AI API error: HTTP {$httpCode} - curl_error={$curlError}");
            echo "data: " . json_encode(['error' => 'AI服务暂时不可用', 'done' => true]) . "\n\n";
            flush();
        }

        echo "data: " . json_encode(['done' => true]) . "\n\n";
        flush();
    }

    private function getUserApiKey(int $userId, string $provider): ?string
    {
        $db = Database::getInstance();
        $row = $db->fetchOne(
            "SELECT key_encrypted FROM user_api_keys WHERE user_id = :user_id AND provider = :provider AND is_valid = 1",
            ['user_id' => $userId, 'provider' => $provider]
        );

        if (!$row) return null;

        $encrypted = base64_decode($row['key_encrypted']);
        $key = getenv('ENCRYPT_KEY') ?: 'lingce_ai_encrypt_key_change_this';
        $ivLen = openssl_cipher_iv_length('aes-256-cbc');
        $iv = substr($encrypted, 0, $ivLen);
        $ciphertext = substr($encrypted, $ivLen);

        return openssl_decrypt($ciphertext, 'aes-256-cbc', $key, OPENSSL_RAW_DATA, $iv);
    }

    public function deleteSession(): void
    {
        $user = AuthMiddleware::handle();
        if (!$user) return;

        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        $sessionId = (int)($input['session_id'] ?? 0);

        if (!$sessionId) {
            ResponseHelper::error('缺少会话ID');
            return;
        }

        $this->messageModel->deleteBySession($sessionId);
        $result = $this->sessionModel->delete($sessionId, $user['id']);

        if ($result) {
            ResponseHelper::success(null, '删除成功');
        } else {
            ResponseHelper::error('删除失败或无权限');
        }
    }
}
