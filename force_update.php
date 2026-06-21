<?php
/**
 * Force Update - substitui ficheiros diretamente do GitHub
 * Uso: /force_update.php?key=dps2026
 */
if (!isset($_GET['key']) || $_GET['key'] !== 'dps2026') {
    http_response_code(403);
    die('Forbidden');
}

$base = __DIR__;
$repo = 'ricardomagalhaes014/dpsimobiliario.pt';
$branch = 'main';
$files = ['index.html', 'raizes/index.html', 'belohorizonte/index.html'];
$results = [];

foreach ($files as $file) {
    $url = "https://raw.githubusercontent.com/{$repo}/{$branch}/{$file}";
    $content = @file_get_contents($url);
    if ($content === false) {
        $results[$file] = 'ERROR: failed to fetch from GitHub';
        continue;
    }
    $dest = $base . '/' . $file;
    $dir = dirname($dest);
    if (!is_dir($dir)) mkdir($dir, 0755, true);
    if (file_put_contents($dest, $content) !== false) {
        $results[$file] = 'UPDATED (' . strlen($content) . ' bytes)';
    } else {
        $results[$file] = 'ERROR: failed to write file';
    }
}

header('Content-Type: application/json');
echo json_encode(['ok' => true, 'results' => $results, 'ts' => date('Y-m-d H:i:s')]);
