<?php
/**
 * @author Tomáš Blatný
 */

if (file_exists(__DIR__ . '/.maintenance')) {
    ?><!DOCTYPE html>
<html data-ng-app="game">
<head lang="en">
    <meta charset="UTF-8">
    <title>Tears of Destiny</title>
</head>
<body>
Maintenance mode, please come back later.
</body>
</html><?php
    die;
}

system('php ' . __DIR__ . '/src/php/server.php > /dev/null 2>/dev/null &', $output); // try to start webSocket server

?><!DOCTYPE html>
<html data-ng-app="game">
<head lang="en">
    <meta charset="UTF-8">
    <title>Tears of Destiny</title>
    <link rel="stylesheet" href="app.css">
</head>
<body>
    <div id="js-check">You need to enable javascript in order to play Tears of Destiny</div>
    <div data-wrapper id="game-wrapper" style="display: none;">Tears of Destiny is loading at the moment. Please wait.</div>
    <script>
        document.getElementById('js-check').style.display = 'none';
        document.getElementById('game-wrapper').style.display = 'block';
    </script>
    <script src="app.js"></script>
</body>
</html>
