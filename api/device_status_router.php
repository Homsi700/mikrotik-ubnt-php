<?php
require_once('../config.php');
require_once('routeros_api.class.php');

header('Content-Type: application/json');

$response = [
    'success' => false,
    'message' => '',
    'active_users' => [],
    'interfaces' => []
];

try {
    $API = new RouterosAPI();
    
    if ($API->connect(MIKROTIK_IP, MIKROTIK_USERNAME, MIKROTIK_PASSWORD)) {
        // جلب المستخدمين النشطين
        $API->write('/ip/hotspot/active/print');
        $active_users = $API->read();
        $response['active_users'] = $active_users;

        // جلب معلومات الواجهات
        $API->write('/interface/print');
        $interfaces = $API->read();
        $response['interfaces'] = $interfaces;

        $response['success'] = true;
        $response['message'] = 'تم جلب البيانات بنجاح';
    } else {
        $response['message'] = 'فشل الاتصال بالمايكروتك';
    }
    
    $API->disconnect();
} catch (Exception $e) {
    $response['message'] = 'حدث خطأ: ' . $e->getMessage();
}

echo json_encode($response);
?>
