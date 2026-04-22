<?php

require_once __DIR__ . '/../Helpers/Database.php';

class UserModel
{
    private $db;

    public function __construct()
    {
        $this->db = Database::getInstance();
    }

    public function findByEmail(string $email): ?array
    {
        return $this->db->fetchOne(
            "SELECT * FROM users WHERE email = :email",
            ['email' => $email]
        );
    }

    public function findById(int $id): ?array
    {
        return $this->db->fetchOne(
            "SELECT id, email, nickname, avatar, role, status, quota_messages, quota_paintings, used_messages, used_paintings, expire_at, last_login_at, created_at FROM users WHERE id = :id",
            ['id' => $id]
        );
    }

    public function create(array $data): int
    {
        $data['password_hash'] = password_hash($data['password'], PASSWORD_BCRYPT);
        unset($data['password']);

        if (empty($data['nickname'])) {
            $data['nickname'] = '用户' . substr(md5($data['email']), 0, 6);
        }
        
        $config = require __DIR__ . '/../../config/app.php';
        
        if (empty($data['expire_at'])) {
            $days = $config['quota']['trial_days'];
            $data['expire_at'] = date('Y-m-d H:i:s', strtotime("+{$days} days"));
        }
        
        // 设置默认配额
        $data['quota_messages'] = $config['quota']['default_messages'];
        $data['quota_paintings'] = $config['quota']['default_paintings'];
        $data['used_messages'] = 0;
        $data['used_paintings'] = 0;
        $data['status'] = 1;
        $data['role'] = 'user';

        return $this->db->insert('users', $data);
    }

    public function updateLoginInfo(int $userId, string $ip = ''): void
    {
        $this->db->update('users', [
            'last_login_at' => date('Y-m-d H:i:s'),
            'last_login_ip' => $ip,
        ], 'id = :id', ['id' => $userId]);
    }

    public function updateQuota(int $userId, string $type = 'message'): bool
    {
        $field = $type === 'painting' ? 'used_paintings' : 'used_messages';
        $sql = "UPDATE users SET {$field} = {$field} + 1 WHERE id = :id AND ({$field} < quota_{$type}s OR quota_{$type}s = -1)";
        $stmt = $this->db->query($sql, ['id' => $userId]);
        return $stmt->rowCount() > 0;
    }

    public function getQuotaInfo(int $userId): array
    {
        $user = $this->findById($userId);
        if (!$user) return [];

        $msgRemaining = $user['quota_messages'] === -1 ? -1 : max(0, $user['quota_messages'] - $user['used_messages']);
        $paintRemaining = $user['quota_paintings'] === -1 ? -1 : max(0, $user['quota_paintings'] - $user['used_paintings']);

        return [
            'messages' => [
                'total' => $user['quota_messages'],
                'used' => $user['used_messages'],
                'remaining' => $msgRemaining,
            ],
            'paintings' => [
                'total' => $user['quota_paintings'],
                'used' => $user['used_paintings'],
                'remaining' => $paintRemaining,
            ],
            'expire_at' => $user['expire_at'],
            'is_expired' => $user['expire_at'] && strtotime($user['expire_at']) < time(),
        ];
    }

    public function list(array $filters = [], int $page = 1, int $pageSize = 20): array
    {
        $where = '1=1';
        $params = [];

        if (!empty($filters['keyword'])) {
            $where .= " AND (email LIKE :keyword OR nickname LIKE :keyword)";
            $params['keyword'] = '%' . $filters['keyword'] . '%';
        }
        if (!empty($filters['role'])) {
            $where .= " AND role = :role";
            $params['role'] = $filters['role'];
        }
        if ($filters['status'] !== null && $filters['status'] !== '') {
            $where .= " AND status = :status";
            $params['status'] = $filters['status'];
        }

        $offset = ($page - 1) * $pageSize;
        $list = $this->db->fetchAll(
            "SELECT id, email, nickname, avatar, role, status, quota_messages, quota_paintings, used_messages, used_paintings, expire_at, last_login_at, created_at FROM users WHERE {$where} ORDER BY created_at DESC LIMIT {$pageSize} OFFSET {$offset}",
            $params
        );

        $total = $this->db->count('users', $where, $params);

        return compact('list', 'total');
    }

    public function updateStatus(int $userId, int $status): bool
    {
        return $this->db->update('users', ['status' => $status], 'id = :id', ['id' => $userId]) > 0;
    }

    public function updateQuotaAdmin(int $userId, array $quota): bool
    {
        $data = [];
        if (isset($quota['messages'])) $data['quota_messages'] = (int)$quota['messages'];
        if (isset($quota['paintings'])) $data['quota_paintings'] = (int)$quota['paintings'];
        if (isset($quota['expire_at'])) $data['expire_at'] = $quota['expire_at'];

        if (empty($data)) return false;

        return $this->db->update('users', $data, 'id = :id', ['id' => $userId]) > 0;
    }

    public function countTotal(): int
    {
        return $this->db->count('users');
    }

    public function countToday(): int
    {
        return $this->db->count("users", "DATE(created_at) = CURDATE()");
    }
}
