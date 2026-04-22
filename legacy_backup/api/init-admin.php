<?php

require_once __DIR__ . '/app/Helpers/Database.php';

$config = require __DIR__ . '/config/app.php';
$db = Database::getInstance();

$pdo = $db->getConnection();

$adminEmail = $argv[1] ?? 'admin@taokeyun.cn';
$adminPassword = $argv[2] ?? 'Admin@2026!';

$exists = $db->fetchOne("SELECT id FROM users WHERE email = :email", ['email' => $adminEmail]);

if ($exists) {
    echo "⚠️  管理员账号已存在: {$adminEmail}\n";
    echo "   如需重置密码，请手动更新数据库\n";
} else {
    $passwordHash = password_hash($adminPassword, PASSWORD_BCRYPT);

    $pdo->exec("INSERT INTO users (email, password_hash, nickname, role, status, quota_messages, quota_paintings, expire_at) VALUES (
        '{$adminEmail}',
        '{$passwordHash}',
        '系统管理员',
        'admin',
        1,
        -1,
        -1,
        NULL
    )");

    echo "✅ 管理员账号创建成功！\n\n";
    echo "   邮箱: {$adminEmail}\n";
    echo "   密码: {$adminPassword}\n\n";
    echo "⚠️  请登录后立即修改默认密码！\n";
}
