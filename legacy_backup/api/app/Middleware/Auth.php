<?php

require_once __DIR__ . '/../Helpers/Database.php';
require_once __DIR__ . '/../Helpers/Response.php';
require_once __DIR__ . '/../Helpers/JWT.php';

class AuthMiddleware
{
    public static function handle(): ?array
    {
        $headers = getallheaders();
        $token = null;

        if (isset($headers['Authorization'])) {
            $authHeader = $headers['Authorization'];
            if (preg_match('/Bearer\s+(.+)$/i', $authHeader, $matches)) {
                $token = $matches[1];
            }
        }

        if (!$token && isset($_GET['token'])) {
            $token = $_GET['token'];
        }

        if (!$token) {
            ResponseHelper::error('未登录或Token已过期', 401);
            return null;
        }

        $payload = JWT::decode($token);
        if (!$payload) {
            ResponseHelper::error('Token无效或已过期', 401);
            return null;
        }

        $db = Database::getInstance();
        $user = $db->fetchOne(
            "SELECT id, email, nickname, avatar, role, status, quota_messages, quota_paintings, expire_at FROM users WHERE id = :id AND status = 1",
            ['id' => $payload['user_id']]
        );

        if (!$user) {
            ResponseHelper::error('用户不存在或已被禁用', 401);
            return null;
        }

        if ($user['expire_at'] && strtotime($user['expire_at']) < time()) {
            ResponseHelper::error('账户已过期，请续费', 403);
            return null;
        }

        return $user;
    }

    public static function adminOnly(?array $user): ?array
    {
        if (!$user || $user['role'] !== 'admin') {
            ResponseHelper::error('无权限访问', 403);
            return null;
        }
        return $user;
    }
}
