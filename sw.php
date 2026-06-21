<?php
// Proxy para sofia-widget.js - serve versão de cleanup (remove pill button)
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');
header('Expires: 0');
header('Content-Type: application/javascript');
$hash = '80b5c4cf';
$url = "https://cdn.jsdelivr.net/gh/ricardomagalhaes014/perfex-crm-grupo-dps-pro@{$hash}/sofia-widget.js";
$content = @file_get_contents($url);
if ($content) {
    echo $content;
} else {
    echo '/* Sofia Widget - disabled */';
}
