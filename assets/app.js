// TechFixHub — minimal JS only: mobile menu + client-side search over the 3 starter articles.
// No tracking, no ads, no framework.
(function () {
  var btn = document.getElementById('menu-btn');
  var nav = document.getElementById('main-nav');
  if (btn && nav) {
    btn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }
  // Article index for search. Keep in sync when new articles are added.
  var ARTICLES = [
    { title: 'How to Speed Up Windows 11: 9 Tested Fixes That Actually Help', url: '/techfixhub/windows/how-to-speed-up-windows-11/', desc: 'A slow Windows 11 PC is often caused by startup apps, full storage, or old drivers. Try these fixes in order.', cat: 'Windows help' },
    { title: 'Wi-Fi Not Working on Windows 11? 10 Fixes to Try', url: '/techfixhub/windows/wifi-not-working-windows-11/', desc: 'No internet, no Wi-Fi icon, or Wi-Fi keeps dropping? Work through these fixes, from the quick checks to Network Reset.', cat: 'Windows help' },
    { title: 'How to Disable Startup Apps in Windows 11', url: '/techfixhub/windows/disable-startup-apps-windows-11/', desc: 'Stop apps opening when Windows starts, so your PC boots faster. Use Settings or Task Manager.', cat: 'Windows help' }
  ];
  function renderResults(q, box) {
    if (!box) return;
    q = (q || '').trim().toLowerCase();
    if (!q) { box.innerHTML = '<p>Type a question above, for example “speed up Windows 11” or “Wi-Fi not working”.</p>'; return; }
    var hits = ARTICLES.filter(function (a) {
      return (a.title + ' ' + a.desc + ' ' + a.cat).toLowerCase().indexOf(q) !== -1;
    });
    if (!hits.length) {
      box.innerHTML = '<p>No guides found for “' + q.replace(/</g, '&lt;') + '”. Try “Windows 11”, “Wi-Fi”, or “startup apps”.</p>';
      return;
    }
    box.innerHTML = hits.map(function (a) {
      return '<div class="search-result"><span class="kicker">' + a.cat + '</span><h3><a href="' + a.url + '">' + a.title + '</a></h3><p>' + a.desc + '</p></div>';
    }).join('');
  }
  // Homepage / header search: go to the search page with the query.
  var forms = document.querySelectorAll('form[data-search-form]');
  forms.forEach(function (f) {
    f.addEventListener('submit', function (e) {
      if (f.getAttribute('data-live') === 'true') return; // search page handles it live
      e.preventDefault();
      var q = f.querySelector('input[type="search"], input[name="q"]').value.trim();
      window.location.href = '/techfixhub/search/?q=' + encodeURIComponent(q);
    });
  });
  // Search page: live filtering.
  var live = document.getElementById('search-input');
  var results = document.getElementById('search-results');
  if (live && results) {
    var params = new URLSearchParams(window.location.search);
    var initial = params.get('q') || '';
    live.value = initial;
    renderResults(initial, results);
    live.addEventListener('input', function () { renderResults(live.value, results); });
  }
})();
