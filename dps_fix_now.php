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

// Boavista Towers - repositório público
if (isset($_GET['boavista']) || isset($_GET['restore_boavista'])) {
    $braw = 'https://raw.githubusercontent.com/ricardomagalhaes014/boavistatowers/master';
    $bfiles = ['boavistatowers/index.html', 'boavistatowers/logo.png', 'boavistatowers/sofia_boavista.png'];
    foreach ($bfiles as $bf) {
        $burl = $braw . '/' . basename($bf) . '?nocache=' . time();
        $ch = curl_init($burl);
        curl_setopt_array($ch, [CURLOPT_RETURNTRANSFER=>true,CURLOPT_FOLLOWLOCATION=>true,CURLOPT_TIMEOUT=>60,CURLOPT_SSL_VERIFYPEER=>false]);
        $bc = curl_exec($ch); $bhttp = curl_getinfo($ch, CURLINFO_HTTP_CODE); curl_close($ch);
        if ($bc && $bhttp === 200 && strlen($bc) > 100) {
            $bdest = __DIR__ . '/' . $bf;
            @mkdir(dirname($bdest), 0755, true);
            $bw = file_put_contents($bdest, $bc);
            $results[$bf] = $bw !== false ? 'WRITTEN:' . $bw : 'WRITE_FAIL';
        } else { $results[$bf] = 'FETCH_FAIL:HTTP' . $bhttp . ':' . strlen($bc ?? ''); }
    }
}

if (function_exists('opcache_reset')) opcache_reset();
header('Content-Type: application/json');
echo json_encode(['ok' => true, 'ts' => date('Y-m-d H:i:s'), 'results' => $results]);
