/* SCJ brand marks — renders the official lockups into hosts:
     .scj-sign            full-color horizontal signature (symbol + wordmark)
     .scj-sign.is-*       single-color signature
     .scj-mark            full-color throne (bojwa) symbol
     .scj-mark.is-*       single-color throne (bojwa) symbol
   Full-color comes from scj-signature.svg (painted from the official class→color map).
   Single-color prefers the official single-path symbol (zcs/_official/scj-mark-black.svg);
   if that asset is unavailable it falls back to a monochrome rendering derived from the
   signature itself (colored shapes → currentColor, white knock-outs dropped).
   Variants: is-mono/is-dark/is-gold/is-silver/is-neg.
   A MutationObserver re-fills hosts that React re-creates. Load after zcs.css. */
(function () {
  var SIGN_SRC = 'zcs/brand/scj-signature.svg';
  var SYM_SRC = 'zcs/_official/scj-mark-black.svg'; // official single-path symbol (viewBox 0 0 70.87 70.87)
  var NS = 'http://www.w3.org/2000/svg';
  var COLORS = {
    'cls-1': '#fff', 'cls-2': '#e1f4fd', 'cls-3': '#25bce7', 'cls-4': '#0089cf',
    'cls-5': '#fcb133', 'cls-6': '#231f20', 'cls-7': '#ed1c24', 'cls-8': '#fff200',
    'cls-9': '#00a651', 'cls-10': '#50b848', 'cls-11': '#231f20', 'cls-12': '#bb5d15',
    'cls-13': '#006bb6', 'cls-14': '#25bce7'
  };
  var WHITE = { 'cls-1': 1, 'cls-2': 1 }; // knock-out fills, dropped in the derived mono fallback
  var T = null, pending = [];

  function shapesOf(svg) { return svg.querySelectorAll('path,polygon,rect,circle,ellipse,line'); }
  function paintColor(svg) {
    var s = shapesOf(svg);
    for (var i = 0; i < s.length; i++) {
      var c = s[i].getAttribute('class');
      if (c && COLORS[c]) s[i].setAttribute('fill', COLORS[c]);
    }
  }
  function paintMono(svg) {
    var s = shapesOf(svg);
    for (var i = 0; i < s.length; i++) s[i].setAttribute('fill', 'currentColor');
  }
  function paintMonoDerived(svg) { // fallback: ink colored shapes, drop white knock-outs
    var s = shapesOf(svg);
    for (var i = 0; i < s.length; i++) {
      var c = s[i].getAttribute('class');
      s[i].setAttribute('fill', c && WHITE[c] ? 'none' : 'currentColor');
    }
  }

  function build(signText, symText) {
    var signDoc = new DOMParser().parseFromString(signText, 'image/svg+xml').documentElement;

    // full-color signature
    var signColor = signDoc.cloneNode(true);
    // full-color symbol = signature cropped to its left square
    var symColor = signDoc.cloneNode(true);
    symColor.setAttribute('viewBox', '0 0 177.09 177.09');

    var symMono, signMono;
    if (symText) {
      var symDoc = new DOMParser().parseFromString(symText, 'image/svg+xml').documentElement;
      var symStyle = symDoc.querySelector('style');
      if (symStyle) symStyle.remove();
      var symInner = symDoc.innerHTML;                 // official single path, viewBox 0 0 70.87 70.87
      var scale = 177.09 / 70.87;
      symMono = document.createElementNS(NS, 'svg');
      symMono.setAttribute('viewBox', '0 0 70.87 70.87');
      symMono.innerHTML = symInner;
      var word = '';
      var w = signDoc.querySelectorAll('.cls-6');
      for (var i = 0; i < w.length; i++) word += w[i].outerHTML;
      signMono = document.createElementNS(NS, 'svg');
      signMono.setAttribute('viewBox', '0 0 536.92 177.09');
      signMono.innerHTML = '<g transform="scale(' + scale + ')">' + symInner + '</g>' + word;
      symMono.dataset.official = '1';
      signMono.dataset.official = '1';
    } else {
      // derived fallback — reuse the signature geometry (symbol already sits in the left 177 square)
      symMono = signDoc.cloneNode(true);
      symMono.setAttribute('viewBox', '0 0 177.09 177.09');
      signMono = signDoc.cloneNode(true);
    }

    T = { signColor: signColor, symColor: symColor, symMono: symMono, signMono: signMono, official: !!symText };
    pending.splice(0).forEach(fill);
  }

  function fill(host) {
    if (host.getAttribute('data-scj') === '1') return;
    if (!T) { pending.push(host); return; }
    var mono = /\bis-(mono|dark|gold|silver|neg)\b/.test(host.className);
    var isMark = host.classList.contains('scj-mark');
    var tmpl = isMark ? (mono ? T.symMono : T.symColor) : (mono ? T.signMono : T.signColor);
    var svg = tmpl.cloneNode(true);
    svg.removeAttribute('width');
    svg.removeAttribute('height');
    svg.removeAttribute('id');
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', host.getAttribute('aria-label') || '신천지예수교 증거장막성전');
    if (mono) { T.official ? paintMono(svg) : paintMonoDerived(svg); } else { paintColor(svg); }
    host.textContent = '';
    host.appendChild(svg);
    host.setAttribute('data-scj', '1');
  }
  function fillAll() {
    var hosts = document.querySelectorAll('.scj-sign,.scj-mark');
    for (var i = 0; i < hosts.length; i++) fill(hosts[i]);
  }

  fetch(SIGN_SRC).then(function (r) { return r.text(); }).then(function (signText) {
    fetch(SYM_SRC)
      .then(function (r) { return r.ok ? r.text() : null; })
      .catch(function () { return null; })
      .then(function (symText) {
        build(signText, symText);
        fillAll();
        var mo = new MutationObserver(function (muts) {
          for (var i = 0; i < muts.length; i++) {
            if (muts[i].addedNodes.length) { fillAll(); break; }
          }
        });
        if (document.body) mo.observe(document.body, { childList: true, subtree: true });
      });
  }).catch(function () {});
})();
