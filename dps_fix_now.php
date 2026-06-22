<?php
// Emergency file fix - writes correct HTML files from GitHub
$files = [
    'index.html',
    'raizes/index.html',
    'belohorizonte/index.html'
];
$repo = 'ricardomagalhaes014/dpsimobiliario.pt';
$results = [];
foreach ($files as $f) {
    $url = "https://raw.githubusercontent.com/{$repo}/main/{$f}?nocache=" . time();
    $content = @file_get_contents($url);
    if (!$content || strlen($content) < 5000) {
        $results[$f] = 'FETCH_FAIL:' . strlen((string)$content);
        continue;
    }
    $dest = __DIR__ . '/' . $f;
    @mkdir(dirname($dest), 0755, true);
    $written = file_put_contents($dest, $content);
    $results[$f] = $written !== false ? 'WRITTEN:' . $written : 'WRITE_FAIL';
}
header('Content-Type: application/json');
echo json_encode(['ok' => true, 'ts' => date('Y-m-d H:i:s'), 'results' => $results]);
