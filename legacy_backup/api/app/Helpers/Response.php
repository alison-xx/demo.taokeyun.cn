<?php

class ResponseHelper
{
    public static function success($data = null, string $message = 'success', int $code = 200): void
    {
        self::json([
            'code' => $code,
            'message' => $message,
            'data' => $data,
            'timestamp' => time(),
        ]);
    }

    public static function error(string $message = 'error', int $code = 400, $errors = null): void
    {
        http_response_code($code);
        self::json([
            'code' => $code,
            'message' => $message,
            'errors' => $errors,
            'timestamp' => time(),
        ]);
    }

    public static function paginated(array $list, int $total, int $page, int $pageSize): void
    {
        self::success([
            'list' => $list,
            'pagination' => [
                'total' => $total,
                'page' => $page,
                'page_size' => $pageSize,
                'total_pages' => ceil($total / $pageSize),
            ],
        ]);
    }

    private static function json(array $data): void
    {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($data, JSON_UNESCAPED_UNICODE);
        exit;
    }
}
