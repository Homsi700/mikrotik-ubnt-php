<?php
require_once('../config.php');

header('Content-Type: application/json');

function getUbntStatus() {
    $url = "http://" . UBNT_IP . "/status.cgi";
    $auth = base64_encode(UBNT_USERNAME . ":" . UBNT_PASSWORD);
    
    $options = [
        'http' => [
            'header' => "Authorization: Basic " . $auth,
            'method' => 'GET'
        ]
    ];
    
    $context = stream_context_create($options);
    
    try {
        $response = file_get_contents($url, false, $context);
        if ($response === false) {
            return [
                'success' => false,
                'message' => 'فشل الاتصال بجهاز UBNT',
                'status' => null
            ];
        }
        
        $data = json_decode($response, true);
        return [
            'success' => true,
            'message' => 'تم جلب البيانات بنجاح',
            'status' => $data
        ];
    } catch (Exception $e) {
        return [
            'success' => false,
            'message' => 'حدث خطأ: ' . $e->getMessage(),
            'status' => null
        ];
    }
}

echo json_encode(getUbntStatus());
?>