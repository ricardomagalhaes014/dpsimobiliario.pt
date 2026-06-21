<?php
// Endpoint de atualização forçada dos ficheiros HTML
if (isset($_GET['update']) && $_GET['update'] === 'go2026') {
    $repo = 'ricardomagalhaes014/dpsimobiliario.pt';
    $files = ['index.html', 'raizes/index.html', 'belohorizonte/index.html'];
    $r = [];
    foreach ($files as $f) {
        $url = "https://raw.githubusercontent.com/{$repo}/main/{$f}?t=" . time();
        $c = @file_get_contents($url);
        if (!$c || strlen($c) < 5000) { $r[$f] = 'FAIL:' . strlen((string)$c); continue; }
        $dest = __DIR__ . '/' . $f;
        @mkdir(dirname($dest), 0755, true);
        $r[$f] = file_put_contents($dest, $c) !== false ? 'OK:' . strlen($c) : 'WRITE_FAIL';
    }
    header('Content-Type: application/json');
    echo json_encode(['ok' => true, 'ts' => date('Y-m-d H:i:s'), 'r' => $r]);
    exit;
}
/**
 * Landing Page Pessoal do Agente - DPS Imobiliário
 * URL: dpsimobiliario.pt/{slug}
 * 
 * Serve a página principal do site mas injeta o botão WhatsApp
 * e o cartão do agente fixo no canto inferior direito.
 */

$slug = isset($_GET['slug']) ? trim($_GET['slug']) : '';

// Validar slug (apenas letras, números e hífens)
if (!preg_match('/^[a-z0-9\-]+$/', $slug)) {
    header('Location: /');
    exit;
}

// Buscar dados do agente na API do CRM
$api_url = 'https://crm.grupo-dps.com/imoveis-api.php?action=agente&slug=' . urlencode($slug);
$context = stream_context_create(['http' => ['timeout' => 5]]);
$response = @file_get_contents($api_url, false, $context);
$agente = null;
$whatsapp = null;
$nome_agente = '';
$foto_agente = '';

if ($response) {
    $data = json_decode($response, true);
    if (!empty($data['success']) && !empty($data['data']['agente'])) {
        $agente = $data['data']['agente'];
        $nome_agente = htmlspecialchars($agente['nome'] . ' ' . $agente['apelido']);
        $foto_agente = !empty($agente['foto_url']) ? htmlspecialchars($agente['foto_url']) : '';
        // Usar campo WhatsApp dedicado; fallback para phonenumber
        $wa_raw = !empty($agente['whatsapp']) ? $agente['whatsapp'] : ($agente['telefone'] ?? '');
        $tel = preg_replace('/[^0-9+]/', '', $wa_raw);
        if (!empty($tel)) {
            // Se começa com 0, substituir por código de país (Portugal por defeito)
            if (substr($tel, 0, 1) === '0') {
                $tel = '351' . substr($tel, 1);
            }
            // Remover o + inicial para o link wa.me
            $tel = ltrim($tel, '+');
            $whatsapp = $tel;
        }
    }
}

// Ler o index.html (homepage) e injectar o widget do agente antes do </body>
// A SPA vai carregar a homepage por defeito (sem hash de rota de agente)
$index_html = file_get_contents(__DIR__ . '/index.html');

// Injectar um script para forçar a SPA a ficar na homepage e não navegar para /{slug}
$force_home_script = '<script>if(window.history && window.history.replaceState){window.history.replaceState(null,"","/");}</script>';
$index_html = str_replace('</head>', $force_home_script . '</head>', $index_html);

// Widget HTML do agente
$widget = '';
if ($agente) {
    $wa_link = $whatsapp
        ? 'https://wa.me/' . $whatsapp . '?text=' . urlencode('Olá ' . trim($agente['nome']) . ', vim através do site DPS Imobiliário e gostaria de saber mais informações.')
        : '#';

    $foto_html = $foto_agente
        ? '<img src="' . $foto_agente . '" alt="' . $nome_agente . '" style="width:56px;height:56px;border-radius:50%;object-fit:cover;border:2px solid #fff;margin-bottom:8px;">'
        : '<div style="width:56px;height:56px;border-radius:50%;background:#1a472a;display:flex;align-items:center;justify-content:center;margin-bottom:8px;font-size:22px;color:#fff;font-weight:700;">' . strtoupper(substr($agente['nome'], 0, 1)) . '</div>';

    $widget = '
<!-- DPS Agent WhatsApp Widget -->
<style>
#dps-agent-widget {
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0;
    font-family: "DM Sans", sans-serif;
}
#dps-agent-card {
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.18);
    padding: 16px 20px 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 160px;
    max-width: 200px;
    margin-bottom: 10px;
    border: 1px solid rgba(0,0,0,0.07);
}
#dps-agent-card .agent-name {
    font-size: 13px;
    font-weight: 600;
    color: #1a1a1a;
    text-align: center;
    margin-bottom: 2px;
    line-height: 1.3;
}
#dps-agent-card .agent-role {
    font-size: 11px;
    color: #888;
    text-align: center;
    margin-bottom: 10px;
}
#dps-wa-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    background: #25D366;
    color: #fff;
    border-radius: 50px;
    padding: 10px 20px;
    font-size: 14px;
    font-weight: 600;
    text-decoration: none;
    box-shadow: 0 4px 16px rgba(37,211,102,0.35);
    transition: background 0.2s, transform 0.15s;
    width: 100%;
}
#dps-wa-btn:hover {
    background: #1ebe5d;
    transform: translateY(-2px);
}
#dps-wa-btn svg {
    flex-shrink: 0;
}
@media (max-width: 600px) {
    #dps-agent-widget {
        bottom: 16px;
        right: 12px;
    }
    #dps-agent-card {
        min-width: 140px;
        padding: 12px 14px 10px;
    }
}
</style>
<div id="dps-agent-widget">
    <div id="dps-agent-card">
        ' . $foto_html . '
        <div class="agent-name">' . $nome_agente . '</div>
        <div class="agent-role">Consultor DPS Imobiliário</div>
        <a id="dps-wa-btn" href="' . $wa_link . '" target="_blank" rel="noopener">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            WhatsApp
        </a>
    </div>
</div>
<!-- /DPS Agent Widget -->
';
} else {
    // Agente não encontrado — redirecionar para a página principal
    header('Location: /');
    exit;
}

// Injectar o widget antes do </body>
$html = str_replace('</body>', $widget . '</body>', $index_html);

// Actualizar o título e meta tags para SEO do agente
$html = str_replace(
    '<title>DPS Imobiliário - Investimentos Imobiliários Premium</title>',
    '<title>' . $nome_agente . ' | DPS Imobiliário</title>',
    $html
);

header('Content-Type: text/html; charset=UTF-8');
echo $html;
