/* Mobile menu. The page works without this file. */
(function () {
  var btn = document.querySelector('.nav-toggle');
  var nav = document.getElementById('nav');
  if (!btn || !nav) { return; }
  btn.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  nav.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') {
      nav.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    }
  });
})();


/* Sideways strips: arrow buttons */
document.querySelectorAll('.strip').forEach(function (strip) {
  var wrap = document.createElement('div');
  wrap.className = 'strip-wrap';
  strip.parentNode.insertBefore(wrap, strip);
  wrap.appendChild(strip);
  function mk(cls, label, txt, dir) {
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'strip-btn ' + cls; b.setAttribute('aria-label', label); b.textContent = txt;
    b.addEventListener('click', function () { strip.scrollBy({ left: dir * strip.clientWidth * 0.8, behavior: 'smooth' }); });
    wrap.appendChild(b); return b;
  }
  var prev = mk('prev', 'Scroll left', '\u2039', -1), next = mk('next', 'Scroll right', '\u203A', 1);
  var bar = document.createElement('div'); bar.className = 'sbar'; bar.setAttribute('aria-hidden', 'true');
  var thumb = document.createElement('div'); thumb.className = 'sbar-thumb'; bar.appendChild(thumb);
  wrap.appendChild(bar);
  function sync() {
    var max = strip.scrollWidth - strip.clientWidth;
    var ratio = strip.clientWidth / strip.scrollWidth;
    var tw = Math.max(40, bar.clientWidth * ratio);
    thumb.style.width = tw + 'px';
    thumb.style.left = (max > 0 ? (strip.scrollLeft / max) * (bar.clientWidth - tw) : 0) + 'px';
    bar.style.display = max > 0 ? '' : 'none';
  }
  function toScroll(clientX, offset) {
    var r = bar.getBoundingClientRect(), tw = thumb.offsetWidth;
    var pos = Math.min(Math.max(clientX - r.left - offset, 0), r.width - tw);
    strip.scrollLeft = (pos / (r.width - tw)) * (strip.scrollWidth - strip.clientWidth);
  }
  thumb.addEventListener('pointerdown', function (e) {
    e.preventDefault(); e.stopPropagation();
    var off = e.clientX - thumb.getBoundingClientRect().left;
    function mv(ev) { toScroll(ev.clientX, off); }
    function up() { document.removeEventListener('pointermove', mv); document.removeEventListener('pointerup', up); }
    document.addEventListener('pointermove', mv); document.addEventListener('pointerup', up);
  });
  bar.addEventListener('pointerdown', function (e) { if (e.target === bar) toScroll(e.clientX, thumb.offsetWidth / 2); });
  strip.addEventListener('scroll', sync); window.addEventListener('resize', sync); window.addEventListener('load', sync); sync();
  function upd() {
    prev.hidden = strip.scrollLeft < 8;
    next.hidden = strip.scrollLeft + strip.clientWidth >= strip.scrollWidth - 8;
  }
  strip.addEventListener('scroll', upd); window.addEventListener('resize', upd); window.addEventListener('load', upd); upd();
});
