<?php
// Fix widgets - força atualização dos ficheiros HTML do GitHub
if (!isset($_GET['key']) || $_GET['key'] !== 'dps2026fix') {
    http_response_code(403);
    die('Forbidden');
}
$base = __DIR__;
$repo = 'ricardomagalhaes014/dpsimobiliario.pt';
$branch = 'main';
$files = ['index.html', 'raizes/index.html', 'belohorizonte/index.html'];
$results = [];
foreach ($files as $file) {
    $url = "https://raw.githubusercontent.com/{$repo}/{$branch}/{$file}?nocache=" . time();
    $ctx = stream_context_create(['http' => ['timeout' => 15, 'ignore_errors' => true]]);
    $content = @file_get_contents($url, false, $ctx);
    if ($content === false || strlen($content) < 1000) {
        $results[$file] = 'ERROR: failed to fetch (' . strlen($content ?: '') . ' bytes)';
        continue;
    }
    $dest = $base . '/' . $file;
    $dir = dirname($dest);
    if (!is_dir($dir)) mkdir($dir, 0755, true);
    $written = file_put_contents($dest, $content);
    if ($written !== false) {
        $results[$file] = 'WRITTEN: ' . $written . ' bytes';
    } else {
        $results[$file] = 'ERROR: write failed';
    }
}
header('Content-Type: application/json');
echo json_encode(['ok' => true, 'results' => $results, 'ts' => date('Y-m-d H:i:s')], JSON_PRETTY_PRINT);
