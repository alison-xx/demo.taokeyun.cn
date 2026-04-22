<?php

require_once __DIR__ . '/../Helpers/Database.php';

class SessionModel
{
    private $db;

    public function __construct()
    {
        $this->db = Database::getInstance();
    }

    public function create(array $data): int
    {
        return $this->db->insert('chat_sessions', $data);
    }

    public function findById(int $id, int $userId): ?array
    {
        return $this->db->fetchOne(
            "SELECT * FROM chat_sessions WHERE id = :id AND user_id = :user_id",
            ['id' => $id, 'user_id' => $userId]
        );
    }

    public function listByUser(int $userId, int $page = 1, int $pageSize = 20): array
    {
        $offset = ($page - 1) * $pageSize;
        $list = $this->db->fetchAll(
            "SELECT id, employee_id, employee_name, title, collaboration_mode, message_count, created_at, updated_at FROM chat_sessions WHERE user_id = :user_id ORDER BY updated_at DESC LIMIT {$pageSize} OFFSET {$offset}",
            ['user_id' => $userId]
        );

        $total = $this->db->count('chat_sessions', 'user_id = :user_id', ['user_id' => $userId]);

        return compact('list', 'total');
    }

    public function updateTitle(int $sessionId, string $title): bool
    {
        return $this->db->update(
            'chat_sessions',
            ['title' => $title],
            'id = :id',
            ['id' => $sessionId]
        ) > 0;
    }

    public function incrementMessageCount(int $sessionId): void
    {
        $this->db->query("UPDATE chat_sessions SET message_count = message_count + 1 WHERE id = :id", ['id' => $sessionId]);
    }

    public function delete(int $sessionId, int $userId): bool
    {
        return $this->db->delete('chat_sessions', 'id = :id AND user_id = :user_id', [
            'id' => $sessionId,
            'user_id' => $userId,
        ]) > 0;
    }

    public function deleteByUser(int $userId): void
    {
        $this->db->delete('chat_sessions', 'user_id = :user_id', ['user_id' => $userId]);
    }
}
