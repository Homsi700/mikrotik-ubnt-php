<?php
// إضافة يوزر برودباند فعلي إلى مايكروتك
require_once __DIR__ . '/routeros_api.class.php';
header('Content-Type: application/json; charset=utf-8');
$data = json_decode(file_get_contents('php://input'), true);
$ip = $data['ip'] ?? '192.168.88.1';
$user = $data['router_user'] ?? 'admin';
$pass = $data['router_pass'] ?? 'admin123';
$username = $data['username'] ?? '';
$password = $data['password'] ?? '';
$speed = $data['speed'] ?? '1M';
$duration = $data['duration'] ?? 30;
if (!$username || !$password) {
    echo json_encode(['success'=>false, 'msg'=>'بيانات ناقصة']);
    exit;
}
$API = new RouterosAPI();
if ($API->connect($ip, $user, $pass)) {
    $API->write('/ppp/secret/add', false);
    $API->write('=name='.$username, false);
    $API->write('=password='.$password, false);
    $API->write('=profile='.$speed, false); // يجب أن يكون لديك بروفايل بنفس اسم السرعة
    $API->write('=comment=تمت الإضافة من لوحة التحكم', true);
    $result = $API->read();
    $API->disconnect();
    echo json_encode(['success'=>true, 'result'=>$result]);
} else {
    echo json_encode(['success'=>false, 'msg'=>'فشل الاتصال بسيرفر مايكروتك']);
}
