<?php

return [
    'app_name' => '灵策智算',
    'app_version' => '1.0.0',
    'debug' => true,
    'timezone' => 'Asia/Shanghai',

    'database' => [
        'driver' => 'mysql',
        'host' => getenv('DB_HOST') ?: 'localhost',
        'port' => getenv('DB_PORT') ?: 3306,
        'database' => getenv('DB_NAME') ?: 'lingce_ai',
        'username' => getenv('DB_USER') ?: 'root',
        'password' => getenv('DB_PASS') ?: '9d22fd6abef30524',
        'charset' => 'utf8mb4',
        'collation' => 'utf8mb4_unicode_ci',
    ],

    'jwt' => [
        'secret' => getenv('JWT_SECRET') ?: 'lingce_ai_secret_key_2026_change_this_in_production',
        'expire' => 7 * 24 * 60 * 60,
        'refresh_expire' => 30 * 24 * 60 * 60,
    ],

    'email' => [
        'smtp_host' => getenv('SMTP_HOST') ?: '',
        'smtp_port' => getenv('SMTP_PORT') ?: 465,
        'smtp_user' => getenv('SMTP_USER') ?: '',
        'smtp_pass' => getenv('SMTP_PASS') ?: '',
        'from_address' => getenv('EMAIL_FROM') ?: 'noreply@taokeyun.cn',
        'from_name' => '灵策智算',
    ],

    'ai_providers' => [
        'deepseek' => [
            'api_url' => 'https://api.deepseek.com/v1/chat/completions',
            'models' => ['deepseek-chat', 'deepseek-reasoner'],
        ],
        'minimax' => [
            'api_url' => 'https://api.minimax.chat/v1/text/chatcompletion_v2',
            'models' => ['abab6.5s-chat', 'abab6.5t-chat'],
        ],
        'siliconflow' => [
            'api_url' => 'https://api.siliconflow.cn/v1/images/generations',
            'models' => ['stable-diffusion-xl-base-1.0', 'flux-schnell'],
        ],
    ],

    'quota' => [
        'default_messages' => 1000,
        'default_paintings' => 50,
        'trial_days' => 7,
    ],
];
