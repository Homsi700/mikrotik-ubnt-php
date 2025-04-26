<!DOCTYPE html>
<html lang="ar">
<head>
    <meta charset="UTF-8">
    <title>تسجيل الدخول - لوحة إدارة الشبكة</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <div class="login-container">
        <h2>تسجيل الدخول</h2>
        <form action="dashboard.php" method="post">
            <label for="username">اسم المستخدم:</label>
            <input type="text" id="username" name="username" required>
            <label for="password">كلمة المرور:</label>
            <input type="password" id="password" name="password" required>
            <button type="submit">دخول</button>
        </form>
    </div>
</body>
</html>
