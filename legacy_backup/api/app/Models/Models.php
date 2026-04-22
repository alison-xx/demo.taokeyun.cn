<?php

require_once __DIR__ . '/../Helpers/Database.php';

class MessageModel
{
    private $db;

    public function __construct()
    {
        $this->db = Database::getInstance();
    }

    public function create(array $data): int
    {
        return $this->db->insert('messages', $data);
    }

    public function listBySession(int $sessionId, int $page = 1, int $pageSize = 50): array
    {
        $offset = ($page - 1) * $pageSize;
        return $this->db->fetchAll(
            "SELECT id, role, content, model_used, token_count, created_at FROM messages WHERE session_id = :session_id ORDER BY created_at ASC LIMIT {$pageSize} OFFSET {$offset}",
            ['session_id' => $sessionId]
        );
    }

    public function deleteBySession(int $sessionId): void
    {
        $this->db->delete('messages', 'session_id = :session_id', ['session_id' => $sessionId]);
    }
}

class PaintingModel
{
    private $db;

    public function __construct()
    {
        $this->db = Database::getInstance();
    }

    public function create(array $data): int
    {
        return $this->db->insert('paintings', $data);
    }

    public function listByUser(int $userId, int $page = 1, int $pageSize = 20): array
    {
        $offset = ($page - 1) * $pageSize;
        $list = $this->db->fetchAll(
            "SELECT id, prompt, style, size, image_url, model, generation_time_ms, created_at FROM paintings WHERE user_id = :user_id ORDER BY created_at DESC LIMIT {$pageSize} OFFSET {$offset}",
            ['user_id' => $userId]
        );

        $total = $this->db->count('paintings', 'user_id = :user_id', ['user_id' => $userId]);

        return compact('list', 'total');
    }

    public function findById(int $id, int $userId): ?array
    {
        return $this->db->fetchOne(
            "SELECT * FROM paintings WHERE id = :id AND user_id = :user_id",
            ['id' => $id, 'user_id' => $userId]
        );
    }

    public function countTotal(): int
    {
        return $this->db->count('paintings');
    }
}

class VerificationCodeModel
{
    private $db;

    public function __construct()
    {
        $this->db = Database::getInstance();
    }

    public function create(string $email, string $code, string $type, string $ip = ''): void
    {
        $this->db->query("DELETE FROM verification_codes WHERE email = :email AND type = :type", [
            'email' => $email,
            'type' => $type,
        ]);

        $this->db->insert('verification_codes', [
            'email' => $email,
            'code' => $code,
            'type' => $type,
            'ip' => $ip,
            'expires_at' => date('Y-m-d H:i:s', strtotime('+10 minutes')),
        ]);
    }

    public function verify(string $email, string $code, string $type): bool
    {
        $record = $this->db->fetchOne(
            "SELECT * FROM verification_codes WHERE email = :email AND code = :code AND type = :type AND used = 0 AND expires_at > NOW()",
            ['email' => $email, 'code' => $code, 'type' => $type]
        );

        if (!$record) return false;

        $this->db->update('verification_codes', ['used' => 1], 'id = :id', ['id' => $record['id']]);
        return true;
    }

    public function canSend(string $email, string $type): bool
    {
        $count = $this->db->count('verification_codes', "email = :email AND type = :type AND created_at > DATE_SUB(NOW(), INTERVAL 1 MINUTE)", [
            'email' => $email,
            'type' => $type,
        ]);
        return $count < 1;
    }
}

class SystemConfigModel
{
    private $db;

    public function __construct()
    {
        $this->db = Database::getInstance();
    }

    public function get(string $key, $default = null)
    {
        $row = $this->db->fetchOne("SELECT config_value, type FROM system_configs WHERE config_key = :key", ['key' => $key]);
        if (!$row) return $default;

        switch ($row['type']) {
            case 'int': return (int)$row['config_value'];
            case 'bool': return (bool)$row['config_value'];
            case 'json': return json_decode($row['config_value'], true) ?? [];
            default: return $row['config_value'];
        }
    }

    public function set(string $key, $value): bool
    {
        $exists = $this->db->fetchOne("SELECT id FROM system_configs WHERE config_key = :key", ['key' => $key]);

        if ($exists) {
            return $this->db->update('system_configs', ['config_value' => $value], 'config_key = :key', ['key' => $key]) > 0;
        } else {
            return $this->db->insert('system_configs', [
                'config_key' => $key,
                'config_value' => (string)$value,
                'type' => is_array($value) ? 'json' : (is_numeric($value) && strpos($value, '.') === false ? 'int' : 'string'),
            ]) > 0;
        }
    }

    public function getByGroup(string $group): array
    {
        return $this->db->fetchAll(
            "SELECT config_key, config_value, description, type, is_public FROM system_configs WHERE config_group = :group ORDER BY id",
            ['group' => $group]
        );
    }

    public function getAllPublic(): array
    {
        return $this->db->fetchAll(
            "SELECT config_key, config_value, type FROM system_configs WHERE is_public = 1"
        );
    }
}

class AdminLogModel
{
    private $db;

    public function __construct()
    {
        $this->db = Database::getInstance();
    }

    public function log(int $adminId, string $action, string $targetType = '', int $targetId = 0, string $content = ''): void
    {
        $this->db->insert('admin_logs', [
            'admin_id' => $adminId,
            'action' => $action,
            'target_type' => $targetType,
            'target_id' => $targetId,
            'content' => $content,
            'ip' => $_SERVER['REMOTE_ADDR'] ?? '',
            'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? '',
        ]);
    }

    public function list(array $filters = [], int $page = 1, int $pageSize = 20): array
    {
        $where = '1=1';
        $params = [];

        if (!empty($filters['admin_id'])) {
            $where .= " AND admin_id = :admin_id";
            $params['admin_id'] = $filters['admin_id'];
        }
        if (!empty($filters['action'])) {
            $where .= " AND action LIKE :action";
            $params['action'] = '%' . $filters['action'] . '%';
        }

        $offset = ($page - 1) * $pageSize;
        $list = $this->db->fetchAll(
            "SELECT * FROM admin_logs WHERE {$where} ORDER BY created_at DESC LIMIT {$pageSize} OFFSET {$offset}",
            $params
        );

        $total = $this->db->count('admin_logs', $where, $params);

        return compact('list', 'total');
    }
}
