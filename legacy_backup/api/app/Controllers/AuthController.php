<?php

require_once __DIR__ . '/../Helpers/Database.php';
require_once __DIR__ . '/../Helpers/Response.php';
require_once __DIR__ . '/../Helpers/JWT.php';
require_once __DIR__ . '/../Models/User.php';
require_once __DIR__ . '/../Models/Models.php';
require_once __DIR__ . '/../Services/Email.php';

class AuthController
{
    private $userModel;
    private $codeModel;

    public function __construct()
    {
        $this->userModel = new UserModel();
        $this->codeModel = new VerificationCodeModel();
    }

    public function sendCode(): void
    {
        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        $email = trim($input['email'] ?? '');
        $type = in_array($input['type'] ?? '', ['register', 'login', 'reset_password']) ? $input['type'] : 'login';

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            ResponseHelper::error('邮箱格式不正确');
            return;
        }

        if (!$this->codeModel->canSend($email, $type)) {
            ResponseHelper::error('验证码发送过于频繁，请1分钟后再试', 429);
            return;
        }

        if ($type === 'register' && $this->userModel->findByEmail($email)) {
            ResponseHelper::error('该邮箱已注册，请直接登录');
            return;
        }

        if ($type === 'login' && !$this->userModel->findByEmail($email)) {
            ResponseHelper::error('该邮箱未注册，请先注册账号');
            return;
        }

        $code = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        $this->codeModel->create($email, $code, $type, $_SERVER['REMOTE_ADDR'] ?? '');
        
        $emailSent = EmailService::sendVerificationCode($email, $code);
        if (!$emailSent) {
            ResponseHelper::success(null, '验证码已发送（邮件发送失败，验证码已记录）');
            return;
        }

        ResponseHelper::success(null, '验证码已发送');
    }

    public function register(): void
    {
        $input = json_decode(file_get_contents('php://input'), true) ?? [];

        $email = trim($input['email'] ?? '');
        $code = trim($input['code'] ?? '');
        $password = $input['password'] ?? '';
        $nickname = trim($input['nickname'] ?? '');

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            ResponseHelper::error('邮箱格式不正确');
            return;
        }

        if (strlen($password) < 6) {
            ResponseHelper::error('密码长度不能少于6位');
            return;
        }

        if (!$this->codeModel->verify($email, $code, 'register')) {
            ResponseHelper::error('验证码无效或已过期');
            return;
        }

        if ($this->userModel->findByEmail($email)) {
            ResponseHelper::error('该邮箱已注册');
            return;
        }

        $userId = $this->userModel->create([
            'email' => $email,
            'password' => $password,
            'nickname' => $nickname,
        ]);

        $token = JWT::encode(['user_id' => $userId, 'role' => 'user']);
        $user = $this->userModel->findById($userId);

        ResponseHelper::success([
            'token' => $token,
            'user' => $this->formatUser($user),
        ], '注册成功');
    }

    public function login(): void
    {
        $input = json_decode(file_get_contents('php://input'), true) ?? [];

        $email = trim($input['email'] ?? '');
        $code = trim($input['code'] ?? '');
        $password = $input['password'] ?? '';

        if (empty($email)) {
            ResponseHelper::error('请输入邮箱');
            return;
        }

        $user = $this->userModel->findByEmail($email);
        if (!$user) {
            ResponseHelper::error('用户不存在');
            return;
        }

        if ($user['status'] !== 1) {
            ResponseHelper::error('账户已被禁用，请联系管理员');
            return;
        }

        if (empty($password)) {
            ResponseHelper::error('请输入密码');
            return;
        }
        
        if (!password_verify($password, $user['password_hash'])) {
            ResponseHelper::error('密码错误');
            return;
        }

        $this->userModel->updateLoginInfo($user['id'], $_SERVER['REMOTE_ADDR'] ?? '');

        $token = JWT::encode(['user_id' => $user['id'], 'role' => $user['role']]);
        $freshUser = $this->userModel->findById($user['id']);

        ResponseHelper::success([
            'token' => $token,
            'user' => $this->formatUser($freshUser),
        ], '登录成功');
    }

    public function profile(): void
    {
        $user = AuthMiddleware::handle();
        if (!$user) return;

        $quotaInfo = $this->userModel->getQuotaInfo($user['id']);

        ResponseHelper::success(array_merge(
            $this->formatUser($user),
            ['quota' => $quotaInfo]
        ));
    }

    public function updateProfile(): void
    {
        $user = AuthMiddleware::handle();
        if (!$user) return;

        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        $data = [];

        if (isset($input['nickname'])) $data['nickname'] = trim($input['nickname']);
        if (isset($input['avatar'])) $data['avatar'] = $input['avatar'];

        if (empty($data)) {
            ResponseHelper::error('没有需要更新的内容');
            return;
        }

        $db = Database::getInstance();
        $db->update('users', $data, 'id = :id', ['id' => $user['id']]);

        $updatedUser = $this->userModel->findById($user['id']);
        ResponseHelper::success($this->formatUser($updatedUser), '更新成功');
    }

    private function formatUser(?array $user): array
    {
        if (!$user) return [];
        return [
            'id' => (int)$user['id'],
            'email' => $user['email'],
            'nickname' => $user['nickname'],
            'avatar' => $user['avatar'],
            'role' => $user['role'],
            'created_at' => $user['created_at'],
        ];
    }
}
