<?php
/**
 * @author Tomáš Blatný
 */

$rev = $argv[1];
$data = json_decode(file_get_contents(__DIR__ . '/../../package.json'));

$versionFile = __DIR__ . '/../../version.json';

$build = 1;
if (file_exists($versionFile)) {
    $versionFileData = json_decode(file_get_contents($versionFile));
    $build = ++$versionFileData->build;
}

$version = $data->version . ' (build #' . $build . ', rev. ' . $rev . ')';
file_put_contents($versionFile, json_encode([
    'build' => $build,
    'version' => $version,
]));

@rename(__DIR__ . '/../../.maintenance', __DIR__ . '/../../.maintenance_off');
