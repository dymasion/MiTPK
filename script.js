// ФинГрамот: режимы для слабовидящих, запоминание выбора,
// открытие консультаций 2–5 по коду, тренажёр «Проверь себя», мобильное меню.
(() => {
  'use strict';

  const SETTINGS_KEY = 'fingramot-settings';
  const ACCESS_KEY = 'fingramot-access';
  const ACCESS_CODE = '2026'; // демонстрационный код для зачёта

  /* ---------- Режимы для слабовидящих ---------- */
  const apply = () => {
    let s = {};
    try { s = JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {}; } catch (e) { s = {}; }
    document.documentElement.classList.toggle('big', s.size === 'big');
    document.documentElement.classList.toggle('contrast', s.contrast === true);
    document.querySelectorAll('.btn-access').forEach((b) => {
      if (b.dataset.size) b.setAttribute('aria-pressed', String((s.size || 'normal') === b.dataset.size));
      if ('contrast' in b.dataset) b.setAttribute('aria-pressed', String(s.contrast === true));
    });
  };

  document.querySelectorAll('.btn-access').forEach((btn) => {
    btn.addEventListener('click', () => {
      let s = {};
      try { s = JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {}; } catch (e) { s = {}; }
      if (btn.dataset.size) s.size = btn.dataset.size;
      if ('contrast' in btn.dataset) s.contrast = !s.contrast;
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
      apply();
    });
  });

  /* ---------- Доступ к консультациям 2–5 ---------- */
  const dialog = document.getElementById('access-dialog');
  const lockedBox = document.getElementById('locked-content');
  const paywallBox = document.getElementById('paywall');

  const unlock = () => {
    localStorage.setItem(ACCESS_KEY, '1');
    if (lockedBox) {
      lockedBox.classList.remove('locked');
      lockedBox.removeAttribute('aria-hidden');
    }
    if (paywallBox) paywallBox.hidden = true;
    if (dialog) dialog.close();
  };

  const isUnlocked = () => {
    try { return localStorage.getItem(ACCESS_KEY) === '1'; } catch (e) { return false; }
  };

  if (lockedBox && paywallBox) {
    if (isUnlocked()) unlock();
    document.querySelectorAll('[data-open-access]').forEach((btn) => {
      btn.addEventListener('click', () => dialog?.showModal());
    });
  }

  if (dialog) {
    const form = document.getElementById('access-form');
    const input = document.getElementById('code');
    const error = document.getElementById('code-error');

    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      if (input.value.trim() === ACCESS_CODE) {
        error.hidden = true;
        input.value = '';
        unlock();
      } else {
        error.hidden = false;
        input.focus();
      }
    });

    dialog.querySelectorAll('[data-close]').forEach((btn) => {
      btn.addEventListener('click', () => dialog.close());
    });
    dialog.addEventListener('click', (e) => {
      if (e.target === dialog) dialog.close();
    });
  }

  /* ---------- Тренажёр «Проверь себя» ---------- */
  document.querySelectorAll('.q').forEach((q) => {
    const buttons = q.querySelectorAll('.q__opts button');
    const result = q.querySelector('.q__result');

    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const right = btn.hasAttribute('data-correct');
        buttons.forEach((b) => {
          b.disabled = true;
          if (b.hasAttribute('data-correct')) b.classList.add('is-right');
        });
        if (!right) btn.classList.add('is-wrong');
        result.textContent = (right ? 'Верно. ' : 'Не совсем. ') + (q.dataset.explain || '');
        result.hidden = false;
      });
    });
  });

  /* ---------- Плавное появление блоков при прокрутке ---------- */
  const revealEls = document.querySelectorAll('section > .container > *, .featured, .card, .howto__item, .contact');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduceMotion && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach((el) => {
      el.classList.add('reveal');
      io.observe(el);
    });
  }

  /* ---------- Мобильное меню ---------- */
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');
  burger?.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
  });

  apply();
})();
