(function () {
  var overlay = document.getElementById('bookingModal');
  if (!overlay) return;

  var form = document.getElementById('bookingForm');
  var success = document.getElementById('bookingSuccess');
  var error = document.getElementById('bookingError');
  var closeBtn = overlay.querySelector('.modal-close');
  var WHATSAPP_URL = 'https://wa.me/79894733754';

  function open() {
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-booking-open]')) {
      e.preventDefault();
      open();
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', close);
  }

  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) close();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay.classList.contains('open')) close();
  });

  function markError(el) {
    el.style.borderColor = '#d0342c';
  }

  function clearError(el) {
    el.style.borderColor = '';
  }

  function hideError() {
    if (error) error.classList.remove('show');
  }

  function getValue(name) {
    var el = form.querySelector('[name="' + name + '"]');
    return el ? el.value.trim() : '';
  }

  function buildMessage() {
    var lines = ['Здравствуйте! Хочу забронировать тур.', ''];
    lines.push('Имя: ' + getValue('name'));
    lines.push('Контакт: ' + getValue('contact'));

    var tour = getValue('tour');
    if (tour) lines.push('Маршрут: ' + tour);

    var date = getValue('date');
    if (date) lines.push('Дата поездки: ' + date);

    var people = getValue('people');
    if (people) lines.push('Человек: ' + people);

    var comment = getValue('comment');
    if (comment) lines.push('Комментарий: ' + comment);

    return lines.join('\n');
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var name = form.querySelector('[name="name"]');
      var contact = form.querySelector('[name="contact"]');
      var ok = true;

      if (!name.value.trim()) {
        markError(name);
        ok = false;
      } else {
        clearError(name);
      }

      if (!contact.value.trim()) {
        markError(contact);
        ok = false;
      } else {
        clearError(contact);
      }

      if (!ok) {
        if (error) error.classList.add('show');
        return;
      }

      hideError();

      var text = encodeURIComponent(buildMessage());
      window.open(WHATSAPP_URL + '?text=' + text, '_blank');

      if (success) {
        success.textContent = 'Спасибо! Мы открыли WhatsApp — нажмите «Отправить», и заявка придёт нам.';
      }
      success.classList.add('show');

      var submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;

      setTimeout(function () {
        close();
        setTimeout(function () {
          form.reset();
          success.classList.remove('show');
          submitBtn.disabled = false;
        }, 300);
      }, 2500);
    });

    form.querySelectorAll('input, select, textarea').forEach(function (el) {
      el.addEventListener('input', function () {
        clearError(el);
        hideError();
      });
      el.addEventListener('change', function () {
        clearError(el);
        hideError();
      });
    });
  }
})();
