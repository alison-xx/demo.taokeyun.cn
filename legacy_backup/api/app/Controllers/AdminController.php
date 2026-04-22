<?php

require_once __DIR__ . '/../Helpers/Database.php';
require_once __DIR__ . '/../Helpers/Response.php';
require_once __DIR__ . '/../Middleware/Auth.php';
require_once __DIR__ . '/../Models/User.php';
require_once __DIR__ . '/../Models/Session.php';
require_once __DIR__ . '/../Models/Models.php';

class AdminController
{
    private $userModel;
    private $sessionModel;
    private $messageModel;
    private $paintingModel;
    private $configModel;
    private $logModel;

    public function __construct()
    {
        $this->userModel = new UserModel();
        $this->sessionModel = new SessionModel();
        $this->messageModel = new MessageModel();
        $this->paintingModel = new PaintingModel();
        $this->configModel = new SystemConfigModel();
        $this->logModel = new AdminLogModel();
    }

    public function dashboard(): void
    {
        $admin = AuthMiddleware::adminOnly(AuthMiddleware::handle());
        if (!$admin) return;

        $db = Database::getInstance();

        ResponseHelper::success([
            'users' => [
                'total' => $this->userModel->countTotal(),
                'today' => $this->userModel->countToday(),
                'active' => $db->count("users", "status=1 AND (expire_at IS NULL OR expire_at > NOW())"),
            ],
            'sessions' => $db->count('chat_sessions'),
            'messages' => $db->count('messages'),
            'paintings' => $this->paintingModel->countTotal(),
            'recent_users' => $db->fetchAll("SELECT id,email,nickname,role,status,last_login_at,created_at FROM users ORDER BY created_at DESC LIMIT 5"),
            'recent_logs' => $db->fetchAll("SELECT id,action,target_type,target_id,content,created_at FROM admin_logs ORDER BY created_at DESC LIMIT 8"),
        ]);
    }

    public function statistics(): void
    {
        $admin = AuthMiddleware::adminOnly(AuthMiddleware::handle());
        if (!$admin) return;

        $days = min(30, max(7, (int)($_GET['days'] ?? 14)));
        $db = Database::getInstance();

        $dailyUsers = [];
        $dailyMessages = [];
        $dailySessions = [];
        $dailyPaintings = [];

        for ($i = $days - 1; $i >= 0; $i--) {
            $date = date('Y-m-d', strtotime("-{$i} days"));
            $nextDate = date('Y-m-d', strtotime("-{$i} days +1 day"));

            $newUsers = $db->count("users", "created_at >= :s AND created_at < :e", ['s' => $date . ' 00:00:00', 'e' => $nextDate . ' 00:00:00']);
            $msgs = $db->count("messages", "created_at >= :s AND created_at < :e AND role='assistant'", ['s' => $date . ' 00:00:00', 'e' => $nextDate . ' 00:00:00']);
            $sess = $db->count("chat_sessions", "created_at >= :s AND created_at < :e", ['s' => $date . ' 00:00:00', 'e' => $nextDate . ' 00:00:00']);
            $pnts = $db->count("paintings", "created_at >= :s AND created_at < :e", ['s' => $date . ' 00:00:00', 'e' => $nextDate . ' 00:00:00']);

            $dailyUsers[] = ['date' => substr($date, 5), 'value' => $newUsers];
            $dailyMessages[] = ['date' => substr($date, 5), 'value' => $msgs];
            $dailySessions[] = ['date' => substr($date, 5), 'value' => $sess];
            $dailyPaintings[] = ['date' => substr($date, 5), 'value' => $pnts];
        }

        $roleDist = $db->fetchAll("SELECT role, COUNT(*) as cnt FROM users GROUP BY role");
        $statusDist = $db->fetchAll("SELECT status, COUNT(*) as cnt FROM users GROUP BY status");

        $topEmployees = $db->fetchAll(
            "SELECT employee_id, employee_name, COUNT(*) as session_count FROM chat_sessions WHERE employee_id IS NOT NULL AND employee_id != '' GROUP BY employee_id ORDER BY session_count DESC LIMIT 10"
        );

        ResponseHelper::success([
            'daily_users' => $dailyUsers,
            'daily_messages' => $dailyMessages,
            'daily_sessions' => $dailySessions,
            'daily_paintings' => $dailyPaintings,
            'role_distribution' => $roleDist,
            'status_distribution' => $statusDist,
            'top_employees' => $topEmployees,
            'summary' => [
                'total_users' => $db->count('users'),
                'total_messages' => $db->count('messages'),
                'total_sessions' => $db->count('chat_sessions'),
                'total_paintings' => $this->paintingModel->countTotal(),
                'avg_messages_per_session' => $db->count('messages') > 0 ? round($db->count('messages') / max(1, $db->count('chat_sessions')), 2) : 0,
            ],
        ]);
    }

    public function listUsers(): void
    {
        $admin = AuthMiddleware::adminOnly(AuthMiddleware::handle());
        if (!$admin) return;

        $filters = [
            'keyword' => $_GET['keyword'] ?? '',
            'role' => $_GET['role'] ?? '',
            'status' => isset($_GET['status']) && $_GET['status'] !== '' ? (int)$_GET['status'] : null,
        ];
        $page = max(1, (int)($_GET['page'] ?? 1));
        $pageSize = min(50, max(10, (int)($_GET['page_size'] ?? 20)));

        $result = $this->userModel->list($filters, $page, $pageSize);

        foreach ($result['list'] as &$u) {
            $u['quota'] = $this->userModel->getQuotaInfo($u['id']);
        }
        unset($u);

        ResponseHelper::paginated($result['list'], $result['total'], $page, $pageSize);
    }

    public function getUserDetail(): void
    {
        $admin = AuthMiddleware::adminOnly(AuthMiddleware::handle());
        if (!$admin) return;

        $userId = (int)($_GET['user_id'] ?? 0);
        if (!$userId) { ResponseHelper::error('缺少用户ID'); return; }

        $user = $this->userModel->findById($userId);
        if (!$user) { ResponseHelper::error('用户不存在'); return; }

        $user['quota'] = $this->userModel->getQuotaInfo($userId);

        $db = Database::getInstance();
        $user['session_count'] = $db->count('chat_sessions', 'user_id = :id', ['id' => $userId]);
        $user['message_count'] = $db->count('messages', 'session_id IN (SELECT id FROM chat_sessions WHERE user_id = :id)', ['id' => $userId]);
        $user['painting_count'] = $db->count('paintings', 'user_id = :id', ['id' => $userId]);

        $recentSessions = $db->fetchAll(
            "SELECT id, employee_name, title, message_count, updated_at FROM chat_sessions WHERE user_id = :uid ORDER BY updated_at DESC LIMIT 5",
            ['uid' => $userId]
        );

        ResponseHelper::success(['user' => $user, 'recent_sessions' => $recentSessions]);
    }

    public function updateUserStatus(): void
    {
        $admin = AuthMiddleware::adminOnly(AuthMiddleware::handle());
        if (!$admin) return;

        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        $userId = (int)($input['user_id'] ?? 0);
        $status = (int)($input['status'] ?? 0);

        if (!$userId || !in_array($status, [0, 1])) {
            ResponseHelper::error('参数错误');
            return;
        }

        $result = $this->userModel->updateStatus($userId, $status);
        $this->logModel->log($admin['id'], 'update_user_status', 'user', $userId, "状态改为: " . ($status ? '正常' : '禁用'));

        if ($result) {
            ResponseHelper::success(null, '操作成功');
        } else {
            ResponseHelper::error('操作失败');
        }
    }

    public function batchUserStatus(): void
    {
        $admin = AuthMiddleware::adminOnly(AuthMiddleware::handle());
        if (!$admin) return;

        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        $ids = $input['ids'] ?? [];
        $status = (int)($input['status'] ?? 0);

        if (empty($ids) || !is_array($ids)) { ResponseHelper::error('请选择用户'); return; }
        if (!in_array($status, [0, 1])) { ResponseHelper::error('参数错误'); return; }

        $ok = 0;
        foreach ($ids as $id) {
            if ($this->userModel->updateStatus((int)$id, $status)) $ok++;
        }

        $this->logModel->log($admin['id'], 'batch_user_status', 'user', 0, "批量" . ($status ? '启用' : '禁用') . " {$ok}/" . count($ids) . " 个用户");

        ResponseHelper::success(['affected' => $ok], "已操作 {$ok} 个用户");
    }

    public function deleteUser(): void
    {
        $admin = AuthMiddleware::adminOnly(AuthMiddleware::handle());
        if (!$admin) return;

        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        $userId = (int)($input['user_id'] ?? 0);

        if (!$userId) { ResponseHelper::error('参数错误'); return; }

        // 不能删除自己
        if ($userId === $admin['id']) { ResponseHelper::error('不能删除自己'); return; }

        // 不能删除其他管理员
        $user = Database::getInstance()->fetchOne(
            "SELECT role FROM users WHERE id = :id",
            ['id' => $userId]
        );
        if ($user && $user['role'] === 'admin') { ResponseHelper::error('不能删除其他管理员'); return; }

        // 删除用户的会话和消息
        $sessions = Database::getInstance()->fetchAll(
            "SELECT id FROM chat_sessions WHERE user_id = :user_id",
            ['user_id' => $userId]
        );
        foreach ($sessions as $session) {
            Database::getInstance()->delete('messages', 'session_id = :session_id', ['session_id' => $session['id']]);
        }
        Database::getInstance()->delete('chat_sessions', 'user_id = :user_id', ['user_id' => $userId]);

        // 删除用户
        $result = Database::getInstance()->delete('users', 'id = :id', ['id' => $userId]);

        if ($result > 0) {
            $this->logModel->log($admin['id'], 'delete_user', 'user', $userId, "删除用户 #{$userId}");
            ResponseHelper::success(null, '用户已删除');
        } else {
            ResponseHelper::error('删除失败');
        }
    }

    public function createAdmin(): void
    {
        $admin = AuthMiddleware::adminOnly(AuthMiddleware::handle());
        if (!$admin) return;

        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        $email = trim($input['email'] ?? '');
        $password = $input['password'] ?? '';

        if (empty($email) || empty($password)) {
            ResponseHelper::error('邮箱和密码不能为空');
            return;
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            ResponseHelper::error('请输入有效的邮箱地址');
            return;
        }

        // 检查邮箱是否已存在
        $existingUser = Database::getInstance()->fetchOne(
            "SELECT id FROM users WHERE email = :email",
            ['email' => $email]
        );
        if ($existingUser) {
            ResponseHelper::error('该邮箱已被注册');
            return;
        }

        // 创建管理员账号
        $passwordHash = password_hash($password, PASSWORD_DEFAULT);
        $result = Database::getInstance()->insert('users', [
            'email' => $email,
            'password_hash' => $passwordHash,
            'role' => 'admin',
            'status' => 1,
            'quota_messages' => -1, // 无限配额
            'quota_paintings' => -1, // 无限配额
            'used_messages' => 0,
            'used_paintings' => 0,
            'created_at' => date('Y-m-d H:i:s'),
            'updated_at' => date('Y-m-d H:i:s')
        ]);

        if ($result) {
            $this->logModel->log($admin['id'], 'create_admin', 'user', $result, "创建管理员账号: {$email}");
            ResponseHelper::success(null, '管理员账号创建成功');
        } else {
            ResponseHelper::error('创建失败');
        }
    }

    public function updateUserQuota(): void
    {
        $admin = AuthMiddleware::adminOnly(AuthMiddleware::handle());
        if (!$admin) return;

        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        $userId = (int)($input['user_id'] ?? 0);
        $quota = $input['quota'] ?? [];

        if (!$userId || empty($quota)) {
            ResponseHelper::error('参数错误');
            return;
        }

        $result = $this->userModel->updateQuotaAdmin($userId, $quota);
        $this->logModel->log($admin['id'], 'update_user_quota', 'user', $userId, json_encode($quota));

        if ($result) {
            ResponseHelper::success(null, '配额更新成功');
        } else {
            ResponseHelper::error('更新失败');
        }
    }

    public function listSessions(): void
    {
        $admin = AuthMiddleware::adminOnly(AuthMiddleware::handle());
        if (!$admin) return;

        $page = max(1, (int)($_GET['page'] ?? 1));
        $pageSize = min(50, max(10, (int)($_GET['page_size'] ?? 20)));
        $offset = ($page - 1) * $pageSize;

        $where = '1=1';
        $params = [];

        if (!empty($_GET['user_id'])) {
            $where .= ' AND s.user_id = :user_id';
            $params['user_id'] = (int)$_GET['user_id'];
        }
        if (!empty($_GET['employee_id'])) {
            $where .= ' AND s.employee_id LIKE :employee_id';
            $params['employee_id'] = '%' . $_GET['employee_id'] . '%';
        }
        if (!empty($_GET['start_date'])) {
            $where .= ' AND s.created_at >= :start_date';
            $params['start_date'] = $_GET['start_date'];
        }
        if (!empty($_GET['end_date'])) {
            $where .= ' AND s.created_at <= :end_date';
            $params['end_date'] = $_GET['end_date'] . ' 23:59:59';
        }

        $db = Database::getInstance();
        $list = $db->fetchAll(
            "SELECT s.*, u.email, u.nickname, s.message_count FROM chat_sessions s LEFT JOIN users u ON s.user_id = u.id WHERE {$where} ORDER BY s.updated_at DESC LIMIT {$pageSize} OFFSET {$offset}",
            $params
        );
        $total = $db->count("chat_sessions s", $where, $params);

        ResponseHelper::paginated($list, $total, $page, $pageSize);
    }

    public function getSessionDetail(): void
    {
        $admin = AuthMiddleware::adminOnly(AuthMiddleware::handle());
        if (!$admin) return;

        $sessionId = (int)($_GET['session_id'] ?? 0);
        if (!$sessionId) { ResponseHelper::error('缺少会话ID'); return; }

        // 获取会话信息，包括用户ID
        $session = Database::getInstance()->fetchOne(
            "SELECT user_id FROM chat_sessions WHERE id = :session_id",
            ['session_id' => $sessionId]
        );

        // 获取用户信息
        $username = '用户';
        if ($session && $session['user_id']) {
            $user = Database::getInstance()->fetchOne(
                "SELECT nickname, email FROM users WHERE id = :user_id",
                ['user_id' => $session['user_id']]
            );
            if ($user) {
                $username = $user['nickname'] ?: $user['email'];
            }
        }

        $messages = $this->messageModel->listBySession($sessionId, 1, 1000);
        ResponseHelper::success(['messages' => $messages, 'username' => $username]);
    }

    public function deleteSession(): void
    {
        $admin = AuthMiddleware::adminOnly(AuthMiddleware::handle());
        if (!$admin) return;

        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        $sessionId = (int)($input['session_id'] ?? 0);

        if (!$sessionId) { ResponseHelper::error('参数错误'); return; }

        $this->messageModel->deleteBySession($sessionId);
        Database::getInstance()->delete('chat_sessions', 'id = :id', ['id' => $sessionId]);

        $this->logModel->log($admin['id'], 'delete_session', 'session', $sessionId, "删除会话 #{$sessionId}");

        ResponseHelper::success(null, '会话已删除');
    }

    public function deleteBatchSessions(): void
    {
        $admin = AuthMiddleware::adminOnly(AuthMiddleware::handle());
        if (!$admin) return;

        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        $ids = $input['ids'] ?? [];

        if (empty($ids) || !is_array($ids)) { ResponseHelper::error('请选择会话'); return; }

        $ok = 0;
        foreach ($ids as $sid) {
            $this->messageModel->deleteBySession((int)$sid);
            if (Database::getInstance()->delete('chat_sessions', 'id = :id', ['id' => (int)$sid]) > 0) $ok++;
        }

        $this->logModel->log($admin['id'], 'batch_delete_session', 'session', 0, "批量删除 {$ok} 个会话");
        ResponseHelper::success(['affected' => $ok], "已删除 {$ok} 个会话");
    }

    public function listConfigs(): void
    {
        $admin = AuthMiddleware::adminOnly(AuthMiddleware::handle());
        if (!$admin) return;

        $group = $_GET['group'] ?? '';
        if ($group) {
            $configs = $this->configModel->getByGroup($group);
        } else {
            $configs = Database::getInstance()->fetchAll(
                "SELECT config_key, config_value, config_group, description, type, is_public, created_at, updated_at FROM system_configs ORDER BY config_group, id"
            );
        }

        ResponseHelper::success($configs);
    }

    public function updateConfig(): void
    {
        $admin = AuthMiddleware::adminOnly(AuthMiddleware::handle());
        if (!$admin) return;

        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        $key = trim($input['key'] ?? '');
        $value = $input['value'] ?? '';

        if (!$key) { ResponseHelper::error('配置键不能为空'); return; }

        $result = $this->configModel->set($key, $value);
        $this->logModel->log($admin['id'], 'update_config', 'config', 0, "{$key} = {$value}");

        if ($result) { ResponseHelper::success(null, '配置更新成功'); }
        else { ResponseHelper::error('配置更新失败'); }
    }

    public function updateBatchConfigs(): void
    {
        $admin = AuthMiddleware::adminOnly(AuthMiddleware::handle());
        if (!$admin) return;

        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        $items = $input['items'] ?? [];

        if (empty($items) || !is_array($items)) { ResponseHelper::error('参数错误'); return; }

        $ok = 0;
        foreach ($items as $item) {
            $k = trim($item['key'] ?? '');
            $v = $item['value'] ?? '';
            if ($k && $this->configModel->set($k, $v)) $ok++;
        }

        $this->logModel->log($admin['id'], 'batch_update_config', 'config', 0, "批量更新 {$ok} 项配置");
        ResponseHelper::success(['affected' => $ok], "已更新 {$ok} 项配置");
    }

    public function publicConfigs(): void
    {
        $configs = $this->configModel->getAllPublic();
        $formatted = [];
        foreach ($configs as $c) { $formatted[$c['config_key']] = $c['config_value']; }
        ResponseHelper::success($formatted);
    }

    public function listLogs(): void
    {
        $admin = AuthMiddleware::adminOnly(AuthMiddleware::handle());
        if (!$admin) return;

        $page = max(1, (int)($_GET['page'] ?? 1));
        $pageSize = min(50, max(10, (int)($_GET['page_size'] ?? 20)));

        $filters = [
            'admin_id' => $_GET['admin_id'] ?? '',
            'action' => $_GET['action'] ?? '',
        ];

        if (!empty($_GET['start_date'])) $filters['start_date'] = $_GET['start_date'];
        if (!empty($_GET['end_date'])) $filters['end_date'] = $_GET['end_date'];

        $result = $this->logModel->list($filters, $page, $pageSize);
        ResponseHelper::paginated($result['list'], $result['total'], $page, $pageSize);
    }

    public function clearLogs(): void
    {
        $admin = AuthMiddleware::adminOnly(AuthMiddleware::handle());
        if (!$admin) return;

        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        $days = (int)($input['days'] ?? 30);
        $days = max(1, min(365, $days));

        $db = Database::getInstance();
        $affected = $db->query(
            "DELETE FROM admin_logs WHERE created_at < DATE_SUB(NOW(), INTERVAL :d DAY)",
            ['d' => $days]
        )->rowCount();

        $this->logModel->log($admin['id'], 'clear_logs', 'system', 0, "清理 {$days} 天前日志，删除 {$affected} 条");
        ResponseHelper::success(['deleted' => $affected], "已清理 {$affected} 条旧日志");
    }

    public function exportUsers(): void
    {
        $admin = AuthMiddleware::adminOnly(AuthMiddleware::handle());
        if (!$admin) return;

        $db = Database::getInstance();
        $rows = $db->fetchAll("
            SELECT id, email, nickname, role, status, quota_messages, quota_paintings,
                   used_messages, used_paintings, expire_at, last_login_at, created_at
            FROM users ORDER BY id ASC
        ");

        header('Content-Type: text/csv; charset=utf-8');
        header('Content-Disposition: attachment; filename="users_export_' . date('Ymd_His') . '.csv"');

        echo "\xEF\xBB\xBF";
        echo "ID,邮箱,昵称,角色,状态,消息配额,消息已用,绘画配额,绘画已用,到期时间,最后登录,注册时间\n";

        foreach ($rows as $r) {
            echo implode(',', [
                $r['id'],
                '"' . str_replace('"', '""', $r['email']) . '"',
                '"' . str_replace('"', '""', $r['nickname']) . '"',
                $r['role'],
                $r['status'],
                $r['quota_messages'],
                $r['used_messages'],
                $r['quota_paintings'],
                $r['used_paintings'],
                $r['expire_at'] ?: '永久',
                $r['last_login_at'] ?: '-',
                $r['created_at'],
            ]) . "\n";
        }
        exit;
    }

    public function systemInfo(): void
    {
        $admin = AuthMiddleware::adminOnly(AuthMiddleware::handle());
        if (!$admin) return;

        $db = Database::getInstance();

        $tables = $db->fetchAll(
            "SELECT TABLE_NAME, TABLE_ROWS, DATA_LENGTH + INDEX_LENGTH as size_bytes, CREATE_TIME, UPDATE_TIME
             FROM information_schema.tables WHERE TABLE_SCHEMA = DATABASE() ORDER BY DATA_LENGTH + INDEX_LENGTH DESC"
        );

        $info = [
            'php_version' => PHP_VERSION,
            'mysql_version' => $db->query("SELECT VERSION()")->fetchColumn() ?: 'unknown',
            'server_os' => PHP_OS,
            'server_time' => date('Y-m-d H:i:s'),
            'server_timezone' => date_default_timezone_get(),
            'memory_limit' => ini_get('memory_limit'),
            'max_execution' => ini_get('max_execution_time') . 's',
            'upload_max' => ini_get('upload_max_filesize'),
            'post_max' => ini_get('post_max_size'),
            'database_tables' => array_map(function($t) {
                return [
                    'name' => $t['TABLE_NAME'],
                    'rows' => $t['TABLE_ROWS'] ?: 0,
                    'size' => round(($t['size_bytes'] ?: 0) / 1024, 1) . ' KB',
                    'created' => $t['CREATE_TIME'],
                ];
            }, $tables),
        ];

        ResponseHelper::success($info);
    }
}
