<?php
// Proxy para sofia-widget.js - serve sempre a versão mais recente sem cache
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');
header('Expires: 0');
header('Content-Type: application/javascript');

$hash = '2fc3bd2cbf66bb2fe5694f07bcce0aa18465ac43';
$url = "https://cdn.jsdelivr.net/gh/ricardomagalhaes014/perfex-crm-grupo-dps-pro@{$hash}/sofia-widget.js";
$content = @file_get_contents($url);
if ($content) {
    echo $content;
} else {
    // Fallback
    echo '/* Sofia Widget - erro ao carregar */';
}
