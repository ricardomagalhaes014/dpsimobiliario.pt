<?php
$base = '/home/u172337921/domains/dpsimobiliario.pt/public_html';

$widgets = [
    'index.html'              => 'agent_0901kv03vzc4eqnvzt5758mms6t8',
    'raizes/index.html'       => 'agent_7501kv0dj084fmbahfdafsfmgcfv',
    'belohorizonte/index.html'=> 'agent_1901kv0dj4m0fxnr5pxqdhqzjf26',
];

$results = [];

foreach ($widgets as $f => $agent_id) {
    $path = $base . '/' . $f;
    if (!file_exists($path)) { $results[$f] = 'NOT_FOUND'; continue; }
    
    $c = file_get_contents($path);
    $orig = $c;
    
    // Remove ALL sofia-widget references
    $c = preg_replace('/<script[^>]*sofia-widget[^>]*><\/script>\s*/i', '', $c);
    $c = preg_replace('/<style[^>]*>[\s\S]*?#dps-btn[\s\S]*?<\/style>\s*/i', '', $c);
    $c = preg_replace('/<style[^>]*>[\s\S]*?#dps-sofia[\s\S]*?<\/style>\s*/i', '', $c);
    
    // Remove existing elevenlabs widget (to avoid duplicates)
    $c = preg_replace('/<elevenlabs-convai[^>]*><\/elevenlabs-convai>\s*/i', '', $c);
    $c = preg_replace('/<script[^>]*elevenlabs\.io\/convai-widget[^>]*><\/script>\s*/i', '', $c);
    
    // Add correct native widget before </body>
    $widget = "\n<elevenlabs-convai agent-id=\"{$agent_id}\"></elevenlabs-convai>\n<script src=\"https://elevenlabs.io/convai-widget/index.js\" async type=\"text/javascript\"></script>\n";
    $c = str_replace('</body>', $widget . '</body>', $c);
    
    if ($c !== $orig) {
        file_put_contents($path, $c);
        $results[$f] = 'UPDATED:' . strlen($c);
    } else {
        $results[$f] = 'ALREADY_OK';
    }
}

echo json_encode(['ok' => true, 'results' => $results, 'ts' => date('Y-m-d H:i:s')]);
