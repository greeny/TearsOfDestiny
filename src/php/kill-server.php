<?php
/**
 * @author Tomáš Blatný
 */

ob_start();
system('ps aux | grep "server.php"');
$grep = ob_get_clean();

preg_match('#www-data\s+?([0-9]+).*php server\.php > /dev/null 2>/dev/null &#m', $grep, $matches);
if (count($matches)) {
    system('kill ' . $matches[1]);
    echo " [INFO]: Server killed\n";
} else {
    echo " [INFO]: Server not running\n";
}
