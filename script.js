/* BeeHappy Technology — site interactions */
(function () {
  'use strict';

  // ===== Year stamp =====
  const yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();

  // ===== Mobile nav toggle =====
  const toggle = document.getElementById('navToggle');
  const links  = document.getElementById('navLinks');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      const open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    links.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ===== Product gallery thumbs =====
  document.querySelectorAll('.thumbs').forEach(function (group) {
    const target = group.getAttribute('data-target');
    const main = document.getElementById(target + '-main');
    if (!main) return;
    const buttons = group.querySelectorAll('button');
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        const img = btn.querySelector('img');
        if (!img) return;
        main.src = img.src;
        main.alt = img.alt;
        buttons.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
      });
    });
  });

  // ===== Category filter (products) =====
  const tabs = document.getElementById('categoryTabs');
  if (tabs) {
    tabs.addEventListener('click', function (e) {
      const btn = e.target.closest('button');
      if (!btn) return;
      tabs.querySelectorAll('button').forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      const cat = btn.getAttribute('data-cat');
      document.querySelectorAll('.product-hero').forEach(function (card) {
        card.style.display = (cat === 'all' || card.getAttribute('data-cat') === cat) ? '' : 'none';
      });
    });
  }

  // ===== Album filter + lightbox =====
  const albumTabs = document.getElementById('albumTabs');
  const albumGrid = document.getElementById('albumGrid');
  if (albumTabs && albumGrid) {
    const items = Array.from(albumGrid.querySelectorAll('.album-card'));
    albumTabs.addEventListener('click', function (e) {
      const btn = e.target.closest('button');
      if (!btn) return;
      albumTabs.querySelectorAll('button').forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      const cat = btn.getAttribute('data-album');
      items.forEach(function (it) {
        it.style.display = (cat === 'all' || it.getAttribute('data-album') === cat) ? '' : 'none';
      });
    });

    const lb      = document.getElementById('lightbox');
    const lbImg   = document.getElementById('lbImg');
    const lbClose = document.getElementById('lbClose');
    const lbPrev  = document.getElementById('lbPrev');
    const lbNext  = document.getElementById('lbNext');
    let curIdx = 0;
    const visible = function () { return items.filter(function (i) { return i.style.display !== 'none'; }); };

    function open(idx) {
      const list = visible();
      if (!list.length) return;
      curIdx = ((idx % list.length) + list.length) % list.length;
      const fig = list[curIdx];
      const src = fig.getAttribute('data-src') || fig.querySelector('img').src;
      const cap = fig.getAttribute('data-caption') || '';
      lbImg.src = src;
      lbImg.alt = cap;
      lb.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
    function close() {
      lb.classList.remove('open');
      document.body.style.overflow = '';
    }
    items.forEach(function (fig, i) {
      fig.addEventListener('click', function () {
        const list = visible();
        const idx = list.indexOf(fig);
        open(idx >= 0 ? idx : i);
      });
    });
    if (lbClose) lbClose.addEventListener('click', close);
    if (lbPrev)  lbPrev.addEventListener('click', function () { open(curIdx - 1); });
    if (lbNext)  lbNext.addEventListener('click', function () { open(curIdx + 1); });
    if (lb) lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') open(curIdx - 1);
      if (e.key === 'ArrowRight') open(curIdx + 1);
    });
  }

  // ===== Contact form (mailto fallback) =====
  const form = document.getElementById('contactForm');
  if (form) {
    // Auto-select product from ?sku=
    try {
      const sku = new URLSearchParams(window.location.search).get('sku');
      if (sku) {
        const sel = document.getElementById('interest');
        if (sel) {
          for (const opt of sel.options) {
            if (opt.value.startsWith(sku)) { sel.value = opt.value; break; }
          }
        }
      }
    } catch (e) { /* ignore */ }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const interest = form.interest.value;
      const message = form.message.value.trim();
      const company = form.company.value.trim();
      const phone = form.phone.value.trim();

      if (!name || !email || !interest || !message) {
        alert('Please fill in all required fields (name, email, product, message).');
        return;
      }

      const subject = encodeURIComponent('BeeHappy inquiry: ' + interest);
      const body = encodeURIComponent(
        'Name: ' + name + '\n' +
        'Company: ' + company + '\n' +
        'Email: ' + email + '\n' +
        'Phone: ' + phone + '\n' +
        'Product: ' + interest + '\n\n' +
        'Message:\n' + message + '\n'
      );
      const status = document.getElementById('formStatus');
      if (status) {
        status.style.display = 'block';
        status.textContent = '✓ Opening your email client...';
      }
      window.location.href = 'mailto:jenny@beehappytech.com?subject=' + subject + '&body=' + body;
    });
  }

  // ===== FAQ: only one open at a time (optional UX) =====
  document.querySelectorAll('.faq-item').forEach(function (item) {
    item.addEventListener('toggle', function () {
      if (item.open) {
        document.querySelectorAll('.faq-item').forEach(function (other) {
          if (other !== item) other.open = false;
        });
      }
    });
  });
})();
