(function() {
  'use strict';

  var SITE_URL = 'https://dpsdubai.grupo-dps.com';
  var SITE_TITLE = 'DPS Imobiliário — Investir em Dubai';

  function injectStyles() {
    var css = `
      #dps-share-widget {
        position: fixed;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        z-index: 9998;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 0;
      }
      #dps-share-toggle {
        background: #C5A55A;
        color: #0a0a0a;
        border: none;
        cursor: pointer;
        writing-mode: vertical-rl;
        text-orientation: mixed;
        transform: rotate(180deg);
        padding: 14px 8px;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 2px;
        text-transform: uppercase;
        font-family: inherit;
        transition: background 0.2s;
        border-radius: 4px 0 0 4px;
      }
      #dps-share-toggle:hover { background: #d4b46a; }
      #dps-share-panel {
        display: none;
        flex-direction: column;
        gap: 0;
        background: #0d1b2e;
        border: 1px solid rgba(197,165,90,0.3);
        border-right: none;
        border-radius: 4px 0 0 4px;
        overflow: hidden;
      }
      #dps-share-panel.open { display: flex; }
      .dps-share-btn {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 12px 16px;
        background: transparent;
        border: none;
        border-bottom: 1px solid rgba(197,165,90,0.15);
        color: #C5A55A;
        cursor: pointer;
        font-size: 12px;
        font-weight: 600;
        letter-spacing: 0.5px;
        text-transform: uppercase;
        font-family: inherit;
        white-space: nowrap;
        transition: background 0.2s, color 0.2s;
        text-decoration: none;
      }
      .dps-share-btn:last-child { border-bottom: none; }
      .dps-share-btn:hover { background: rgba(197,165,90,0.12); color: #d4b46a; }
      .dps-share-btn svg { flex-shrink: 0; }
      #dps-copy-toast {
        position: fixed;
        bottom: 80px;
        right: 20px;
        background: #C5A55A;
        color: #0a0a0a;
        padding: 10px 20px;
        border-radius: 4px;
        font-size: 13px;
        font-weight: 700;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.3s;
        pointer-events: none;
      }
      #dps-copy-toast.show { opacity: 1; }
    `;
    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
  }

  function shareOnFacebook() {
    window.open('https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(SITE_URL), '_blank', 'width=600,height=400');
  }

  function shareOnWhatsApp() {
    var text = SITE_TITLE + ' - ' + SITE_URL;
    window.open('https://wa.me/?text=' + encodeURIComponent(text), '_blank');
  }

  function shareOnInstagram() {
    // Instagram não tem API de partilha web - abre o app em mobile ou o perfil em desktop
    // Usamos Web Share API se disponível (funciona em mobile)
    if (navigator.share) {
      navigator.share({
        title: SITE_TITLE,
        url: SITE_URL
      }).catch(function() {});
    } else {
      // Em desktop, copiar o link para colar no Instagram
      copyLink(true);
    }
  }

  function copyLink(forInstagram) {
    var text = forInstagram ? 'Link copiado! Cole no Instagram.' : 'Link copiado!';
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(SITE_URL).then(function() {
        showToast(text);
      }).catch(function() {
        fallbackCopy(text);
      });
    } else {
      fallbackCopy(text);
    }
  }

  function fallbackCopy(toastText) {
    var ta = document.createElement('textarea');
    ta.value = SITE_URL;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch(e) {}
    document.body.removeChild(ta);
    showToast(toastText || 'Link copiado!');
  }

  function showToast(msg) {
    var toast = document.getElementById('dps-copy-toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(function() { toast.classList.remove('show'); }, 2500);
  }

  function buildWidget() {
    var widget = document.createElement('div');
    widget.id = 'dps-share-widget';

    var panel = document.createElement('div');
    panel.id = 'dps-share-panel';

    // Botão Instagram
    var btnInsta = document.createElement('button');
    btnInsta.className = 'dps-share-btn';
    btnInsta.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg> Instagram';
    btnInsta.onclick = shareOnInstagram;
    panel.appendChild(btnInsta);

    // Botão Facebook
    var btnFb = document.createElement('button');
    btnFb.className = 'dps-share-btn';
    btnFb.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg> Facebook';
    btnFb.onclick = shareOnFacebook;
    panel.appendChild(btnFb);

    // Botão WhatsApp
    var btnWa = document.createElement('button');
    btnWa.className = 'dps-share-btn';
    btnWa.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg> WhatsApp';
    btnWa.onclick = shareOnWhatsApp;
    panel.appendChild(btnWa);

    // Botão Copiar Link
    var btnLink = document.createElement('button');
    btnLink.className = 'dps-share-btn';
    btnLink.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg> Copiar Link';
    btnLink.onclick = function() { copyLink(false); };
    panel.appendChild(btnLink);

    // Botão toggle
    var toggle = document.createElement('button');
    toggle.id = 'dps-share-toggle';
    toggle.textContent = '⬡ Partilhar';
    toggle.onclick = function() {
      panel.classList.toggle('open');
    };

    widget.appendChild(panel);
    widget.appendChild(toggle);

    // Toast
    var toast = document.createElement('div');
    toast.id = 'dps-copy-toast';
    toast.textContent = 'Link copiado!';

    document.body.appendChild(widget);
    document.body.appendChild(toast);
  }

  function init() {
    injectStyles();
    buildWidget();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
