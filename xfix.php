<?php
if ($_GET['k'] !== 'go2026') { die('no'); }
$files = [
    'raizes/index.html',
    'belohorizonte/index.html', 
    'index.html'
];
$repo = 'ricardomagalhaes014/dpsimobiliario.pt';
$r = [];
foreach ($files as $f) {
    $url = "https://raw.githubusercontent.com/{$repo}/main/{$f}?" . time();
    $c = @file_get_contents($url);
    if (!$c || strlen($c) < 5000) { $r[$f] = 'FAIL:' . strlen($c); continue; }
    $dest = __DIR__ . '/' . $f;
    @mkdir(dirname($dest), 0755, true);
    $r[$f] = file_put_contents($dest, $c) ? 'OK:' . strlen($c) : 'WRITE_FAIL';
}
header('Content-Type: application/json');
echo json_encode($r);
