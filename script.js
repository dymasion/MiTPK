// ФинГрамот — интерактивные элементы памятки

(function () {
  'use strict';

  // --- Мобильное меню ---
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');

  if (burger && nav) {
    burger.addEventListener('click', function () {
      nav.classList.toggle('open');
    });

    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') nav.classList.remove('open');
    });
  }

  // --- Форма записи на консультацию ---
  var form = document.getElementById('form');
  var ok = document.getElementById('form-ok');

  if (form && ok) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var name = document.getElementById('f-name');
      var phone = document.getElementById('f-phone');

      if (!name.value.trim()) {
        name.focus();
        name.style.borderColor = '#e8464f';
        return;
      }
      if (phone.value.trim().length < 6) {
        phone.focus();
        phone.style.borderColor = '#e8464f';
        return;
      }

      name.style.borderColor = '';
      phone.style.borderColor = '';

      form.querySelector('button[type="submit"]').style.display = 'none';
      form.querySelector('.form__hint').style.display = 'none';
      ok.classList.add('show');
      ok.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  // --- Подсветка активного раздела в шапке ---
  var sections = ['about', 'topics', 'victim', 'checklist', 'contacts'];
  var links = nav ? nav.querySelectorAll('a') : [];

  if ('IntersectionObserver' in window && links.length) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (a) {
          a.style.color = a.getAttribute('href') === '#' + entry.target.id ? '#0b4ca1' : '';
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    sections.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) observer.observe(el);
    });
  }
})();
