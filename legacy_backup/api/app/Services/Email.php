<?php

require_once __DIR__ . '/../../vendor/autoload.php';

class EmailService
{
    private static function getEmailConfig(): array
    {
        require_once __DIR__ . '/../Helpers/Database.php';

        $db = Database::getInstance();

        $configKeys = ['smtp_host', 'smtp_port', 'smtp_user', 'smtp_pass', 'from_address', 'from_name'];
        $dbConfig = [];

        foreach ($configKeys as $key) {
            $row = $db->fetchOne("SELECT config_value FROM system_configs WHERE config_key = :key", ['key' => $key]);
            $dbConfig[$key] = $row['config_value'] ?? '';
        }

        $appConfig = require __DIR__ . '/../../config/app.php';
        $emailConfig = $appConfig['email'];

        return [
            'smtp_host' => $dbConfig['smtp_host'] ?: $emailConfig['smtp_host'],
            'smtp_port' => (int)($dbConfig['smtp_port'] ?: $emailConfig['smtp_port']),
            'smtp_user' => $dbConfig['smtp_user'] ?: $emailConfig['smtp_user'],
            'smtp_pass' => $dbConfig['smtp_pass'] ?: $emailConfig['smtp_pass'],
            'from_address' => $dbConfig['from_address'] ?: ($dbConfig['smtp_user'] ?: $emailConfig['from_address']),
            'from_name' => $dbConfig['from_name'] ?: $emailConfig['from_name'],
        ];
    }

    private static function getMailer(): ?PHPMailer\PHPMailer\PHPMailer
    {
        if (!class_exists('PHPMailer\PHPMailer\PHPMailer')) {
            error_log('PHPMailer class not found');
            return null;
        }

        $emailConfig = self::getEmailConfig();

        if (empty($emailConfig['smtp_host'])) {
            error_log('SMTP host is empty');
            return null;
        }

        try {
            $mail = new PHPMailer\PHPMailer\PHPMailer(true);
            $mail->isSMTP();
            $mail->Host = $emailConfig['smtp_host'];
            $mail->Port = $emailConfig['smtp_port'];
            $mail->SMTPSecure = PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_SMTPS;
            $mail->SMTPAuth = true;
            $mail->Username = $emailConfig['smtp_user'];
            $mail->Password = $emailConfig['smtp_pass'];
            $mail->CharSet = 'UTF-8';
            $mail->setFrom($emailConfig['from_address'], $emailConfig['from_name']);

            return $mail;
        } catch (Exception $e) {
            error_log('Failed to create PHPMailer instance: ' . $e->getMessage());
            return null;
        }
    }

    public static function sendVerificationCode(string $email, string $code): bool
    {
        try {
            $mailer = self::getMailer();

            if (!$mailer) {
                error_log("Mailer not available, logging code to file for: {$email}");
                self::logCodeToFile($email, $code);
                return false;
            }

            $mailer->addAddress($email);
            $mailer->Subject = '【灵策智算】验证码';
            $mailer->Body = "您的验证码是：{$code}\n\n验证码10分钟内有效，请勿泄露给他人。\n\n如非本人操作，请忽略此邮件。";
            $mailer->AltText = "您的验证码是：{$code}，10分钟内有效。";

            $result = $mailer->send();
            error_log("Email sent successfully to: {$email}");
            return true;

        } catch (Exception $e) {
            error_log("Email send failed for {$email}: " . $e->getMessage());
            self::logCodeToFile($email, $code);
            return false;
        }
    }

    public static function testConnection(): array
    {
        try {
            $mailer = self::getMailer();

            if (!$mailer) {
                return ['success' => false, 'error' => '无法初始化邮件发送器，请检查 SMTP 配置'];
            }

            $mailer->addAddress('test@test.com');
            $mailer->Subject = 'SMTP 连接测试';
            $mailer->Body = '这是一封测试邮件，请忽略。';

            $result = $mailer->send();
            if ($result) {
                return ['success' => true, 'message' => 'SMTP 连接成功，测试邮件已发送'];
            } else {
                return ['success' => false, 'error' => 'SMTP 发送失败'];
            }
        } catch (Exception $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }

    private static function logCodeToFile(string $email, string $code): void
    {
        $logDir = __DIR__ . '/../../storage/logs';
        if (!is_dir($logDir)) {
            mkdir($logDir, 0755, true);
        }

        $logFile = $logDir . '/verification_codes.log';
        $logEntry = date('Y-m-d H:i:s') . " | {$email} | {$code}\n";
        file_put_contents($logFile, $logEntry, FILE_APPEND | LOCK_EX);
    }
}
