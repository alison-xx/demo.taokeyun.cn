<?php

error_reporting(E_ALL);
ini_set('display_errors', '0');
ini_set('log_errors', '1');

define('BASE_PATH', dirname(__DIR__));
define('API_PATH', __DIR__);

require_once BASE_PATH . '/app/Helpers/Database.php';
require_once BASE_PATH . '/app/Helpers/Response.php';
require_once BASE_PATH . '/app/Helpers/JWT.php';
require_once BASE_PATH . '/app/Middleware/Auth.php';
require_once BASE_PATH . '/app/Controllers/AuthController.php';
require_once BASE_PATH . '/app/Controllers/ChatController.php';
require_once BASE_PATH . '/app/Controllers/AdminController.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];

$uri = preg_replace('#^/api#', '', $uri);
$uri = rtrim($uri, '/') ?: '/';

$authCtrl = new AuthController();
$chatCtrl = new ChatController();
$adminCtrl = new AdminController();

switch ("{$method} {$uri}") {
    case 'GET /':
        ResponseHelper::success(['name' => '灵策智算 API', 'version' => '1.0.0', 'time' => date('Y-m-d H:i:s')]);
        break;

    case 'POST /auth/send-code':
        $authCtrl->sendCode();
        break;

    case 'POST /auth/register':
        $authCtrl->register();
        break;

    case 'POST /auth/login':
        $authCtrl->login();
        break;

    case 'GET /auth/profile':
        $authCtrl->profile();
        break;

    case 'POST /auth/profile':
        $authCtrl->updateProfile();
        break;

    case 'GET /chat/sessions':
        $chatCtrl->listSessions();
        break;

    case 'POST /chat/session/create':
        $chatCtrl->createSession();
        break;

    case 'GET /chat/messages':
        $chatCtrl->getSessionMessages();
        break;

    case 'POST /chat/send':
        $chatCtrl->sendMessage();
        break;

    case 'POST /chat/stream':
        $chatCtrl->streamSendMessage();
        break;

    case 'POST /chat/session/delete':
        $chatCtrl->deleteSession();
        break;

    case 'GET /admin/dashboard':
        $adminCtrl->dashboard();
        break;

    case 'GET /admin/statistics':
        $adminCtrl->statistics();
        break;

    case 'GET /admin/users':
        $adminCtrl->listUsers();
        break;

    case 'GET /admin/user/detail':
        $adminCtrl->getUserDetail();
        break;

    case 'POST /admin/user/status':
        $adminCtrl->updateUserStatus();
        break;

    case 'POST /admin/users/batch-status':
        $adminCtrl->batchUserStatus();
        break;

    case 'POST /admin/user/delete':
        $adminCtrl->deleteUser();
        break;

    case 'POST /admin/user/quota':
        $adminCtrl->updateUserQuota();
        break;

    case 'GET /admin/users/export':
        $adminCtrl->exportUsers();
        break;

    case 'GET /admin/sessions':
        $adminCtrl->listSessions();
        break;

    case 'GET /admin/session/detail':
        $adminCtrl->getSessionDetail();
        break;

    case 'POST /admin/session/delete':
        $adminCtrl->deleteSession();
        break;

    case 'POST /admin/sessions/batch-delete':
        $adminCtrl->deleteBatchSessions();
        break;

    case 'GET /admin/configs':
        $adminCtrl->listConfigs();
        break;

    case 'POST /admin/config/update':
        $adminCtrl->updateConfig();
        break;

    case 'POST /admin/configs/batch-update':
        $adminCtrl->updateBatchConfigs();
        break;

    case 'GET /admin/logs':
        $adminCtrl->listLogs();
        break;

    case 'POST /admin/logs/clear':
        $adminCtrl->clearLogs();
        break;

    case 'GET /admin/system/info':
        $adminCtrl->systemInfo();
        break;

    case 'GET /public/configs':
        $adminCtrl->publicConfigs();
        break;

    default:
        ResponseHelper::error('接口不存在', 404);
        break;
}
