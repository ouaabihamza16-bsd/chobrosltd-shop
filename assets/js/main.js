/* CHO BROS LTD - site scripts: mobile menu, smooth scroll, legal modals.
   This site has no contact form: the only published contact route is post
   to the registered office. */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Mobile menu ---------- */
  var toggle = document.getElementById('menu-toggle');
  var menu = document.getElementById('mobile-menu');

  function setMenu(open) {
    if (!toggle || !menu) return;
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    menu.classList.toggle('hidden', !open);
    var label = toggle.querySelector('[data-menu-label]');
    if (label) label.textContent = open ? 'Close menu' : 'Open menu';
    var iconOpen = toggle.querySelector('[data-icon-open]');
    var iconClose = toggle.querySelector('[data-icon-close]');
    if (iconOpen) iconOpen.classList.toggle('hidden', open);
    if (iconClose) iconClose.classList.toggle('hidden', !open);
  }

  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      setMenu(toggle.getAttribute('aria-expanded') !== 'true');
    });

    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setMenu(false);
        toggle.focus();
      }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth >= 768) setMenu(false);
    });
  }

  /* ---------- Smooth scroll for in-page links ---------- */
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href^="#"]');
    if (!link) return;
    var id = link.getAttribute('href');
    if (id.length < 2) return;
    var target = document.getElementById(id.slice(1));
    if (!target) return;

    e.preventDefault();
    target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });

    // Move focus for keyboard and screen reader users without jumping the page.
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });

    if (history.pushState) history.pushState(null, '', id);
  });

  /* ---------- Legal modals (<dialog>, Esc closes natively) ---------- */
  var lastTrigger = null;

  function closeDialog(dialog) {
    if (dialog && dialog.open) dialog.close();
  }

  document.querySelectorAll('[data-open-modal]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var dialog = document.getElementById(btn.getAttribute('data-open-modal'));
      if (!dialog) return;
      lastTrigger = btn;
      if (typeof dialog.showModal === 'function') {
        dialog.showModal();
      } else {
        dialog.setAttribute('open', '');
      }
      document.body.classList.add('modal-open');
      var closeBtn = dialog.querySelector('[data-close-modal]');
      if (closeBtn) closeBtn.focus();
    });
  });

  document.querySelectorAll('dialog').forEach(function (dialog) {
    dialog.querySelectorAll('[data-close-modal]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (typeof dialog.close === 'function') {
          closeDialog(dialog);
        } else {
          dialog.removeAttribute('open');
          document.body.classList.remove('modal-open');
        }
      });
    });

    // Click on the backdrop closes the dialog.
    dialog.addEventListener('click', function (e) {
      if (e.target === dialog) closeDialog(dialog);
    });

    dialog.addEventListener('close', function () {
      document.body.classList.remove('modal-open');
      if (lastTrigger) lastTrigger.focus();
    });
  });

  /* ---------- Footer year ---------- */
  var year = String(new Date().getFullYear());
  document.querySelectorAll('[data-year]').forEach(function (el) {
    if (Number(year) >= 2026) el.textContent = year;
  });
})();
