<?php
require_once('../config.php');
require_once('routeros_api.class.php');

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method Not Allowed']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['name']) || !isset($data['ip']) || !isset($data['type'])) {
    echo json_encode(['success' => false, 'message' => 'البيانات المطلوبة غير مكتملة']);
    exit;
}

$response = ['success' => false, 'message' => ''];

try {
    // حفظ بيانات الجهاز في قاعدة البيانات أو ملف
    // يمكن إضافة هذا الجزء لاحقاً
    
    // اختبار الاتصال بالجهاز
    if ($data['type'] === 'mikrotik') {
        $API = new RouterosAPI();
        if ($API->connect($data['ip'], MIKROTIK_USERNAME, MIKROTIK_PASSWORD)) {
            $response['success'] = true;
            $response['message'] = 'تم إضافة جهاز المايكروتك بنجاح';
            $API->disconnect();
        } else {
            $response['message'] = 'فشل الاتصال بجهاز المايكروتك';
        }
    } elseif ($data['type'] === 'mimosa') {
        $url = "http://" . $data['ip'] . "/status/json";
        $auth = base64_encode(MIMOSA_USERNAME . ":" . MIMOSA_PASSWORD);
        
        $options = [
            'http' => [
                'header' => "Authorization: Basic " . $auth,
                'method' => 'GET'
            ]
        ];
        
        $context = stream_context_create($options);
        if (@file_get_contents($url, false, $context)) {
            $response['success'] = true;
            $response['message'] = 'تم إضافة جهاز Mimosa بنجاح';
        } else {
            $response['message'] = 'فشل الاتصال بجهاز Mimosa';
        }
    } else {
        $response['message'] = 'نوع الجهاز غير معروف';
    }
} catch (Exception $e) {
    $response['message'] = 'حدث خطأ: ' . $e->getMessage();
}

echo json_encode($response);
?>
