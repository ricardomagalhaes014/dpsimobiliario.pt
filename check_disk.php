<?php
$content = file_get_contents(__DIR__ . '/raizes/index.html');
preg_match('/sofia-widget[^"\']*/', $content, $m);
echo json_encode(['sofia_url' => $m[0] ?? 'not found', 'file_size' => strlen($content), 'mtime' => filemtime(__DIR__ . '/raizes/index.html')]);
