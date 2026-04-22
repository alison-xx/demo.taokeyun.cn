<?php

require_once __DIR__ . '/../database/migrations/create_tables.php';

$migration = new Migration();
try {
    $migration->run();
    echo "\n✅ 数据库初始化完成！\n";
} catch (Exception $e) {
    echo "\n❌ 错误: " . $e->getMessage() . "\n";
}
