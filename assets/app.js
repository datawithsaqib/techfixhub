// TechFixHub — minimal JS only: mobile menu + client-side search.
// No tracking, no ads, no framework.
(function () {
  // Mobile menu: toggles the nav and keeps aria-expanded in sync.
  var btn = document.getElementById('menu-btn');
  var nav = document.getElementById('main-nav');
  if (btn && nav) {
    btn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // Fallback index, used if search-index.json cannot be fetched.
  var FALLBACK_ARTICLES = [
    { title: 'How to Speed Up Windows 11: 9 Fixes That Actually Help', url: '/techfixhub/windows/how-to-speed-up-windows-11/', desc: 'A slow Windows 11 PC is often caused by startup apps, full storage, or old drivers. Try these fixes in order.', cat: 'Windows help', keywords: 'slow speed performance startup storage update drivers power' },
    { title: 'Wi-Fi Not Working on Windows 11? 10 Fixes to Try', url: '/techfixhub/windows/wifi-not-working-windows-11/', desc: 'No internet, no Wi-Fi icon, or Wi-Fi keeps dropping? Work through these fixes, from the quick checks to Network Reset.', cat: 'Windows help', keywords: 'wifi wi-fi wireless internet network router driver no internet disconnect' },
    { title: 'How to Disable Startup Apps in Windows 11', url: '/techfixhub/windows/disable-startup-apps-windows-11/', desc: 'Stop apps opening when Windows starts, so your PC boots faster. Use Settings or Task Manager.', cat: 'Windows help', keywords: 'startup apps boot task manager settings disable enable' }
  ];
  var ARTICLES = FALLBACK_ARTICLES;

  // Escape text before putting it in the page, so < > " ' & in a query
  // cannot break the page or inject HTML.
  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function renderResults(q, box) {
    if (!box) return;
    q = (q || '').trim();
    if (!q) {
      box.innerHTML = '<p>Type a question above, for example “speed up Windows 11” or “Wi-Fi not working”.</p>';
      return;
    }
    var needle = q.toLowerCase();
    var hits = ARTICLES.filter(function (a) {
      var hay = (a.title + ' ' + a.desc + ' ' + (a.cat || '') + ' ' + (a.keywords || '')).toLowerCase();
      return hay.indexOf(needle) !== -1;
    });
    if (!hits.length) {
      box.innerHTML = '<p>No guides found for “' + escapeHtml(q) + '”. Try “Windows 11”, “Wi-Fi”, or “startup apps”.</p>';
      return;
    }
    box.innerHTML = hits.map(function (a) {
      return '<div class="search-result"><span class="kicker">' + escapeHtml(a.cat || 'Guide') + '</span><h3><a href="' + escapeHtml(a.url) + '">' + escapeHtml(a.title) + '</a></h3><p>' + escapeHtml(a.desc) + '</p></div>';
    }).join('');
  }

  // Search page: live filtering. Renders once with the fallback list, then
  // again when the generated index loads, so new articles appear without
  // editing this file.
  var live = document.getElementById('search-input');
  var results = document.getElementById('search-results');
  function renderSearchPage() {
    if (!live || !results) return;
    var params = new URLSearchParams(window.location.search);
    var initial = params.get('q') || '';
    live.value = initial;
    renderResults(initial, results);
  }
  if (live && results) {
    renderSearchPage();
    live.addEventListener('input', function () { renderResults(live.value, results); });
  }

  // Load the generated search index. On failure, keep the fallback list.
  if (typeof fetch === 'function') {
    fetch('/techfixhub/assets/search-index.json')
      .then(function (r) { if (!r.ok) throw new Error('index not loaded'); return r.json(); })
      .then(function (data) {
        var list = data && data.articles ? data.articles : data;
        if (Array.isArray(list) && list.length) {
          ARTICLES = list;
          renderSearchPage();
        }
      })
      .catch(function () { /* keep the fallback list */ });
  }

  // Header search forms (homepage, category pages, articles): go to the
  // search page under the project path with the query.
  var forms = document.querySelectorAll('form[data-search-form]');
  forms.forEach(function (f) {
    f.addEventListener('submit', function (e) {
      if (f.getAttribute('data-live') === 'true') return; // search page handles it live
      e.preventDefault();
      var input = f.querySelector('input[type="search"], input[name="q"]');
      var q = input ? input.value.trim() : '';
      window.location.href = '/techfixhub/search/?q=' + encodeURIComponent(q);
    });
  });
})();
