(function () {
  var overlay = document.getElementById('bookingModal');
  if (!overlay) return;

  var form = document.getElementById('bookingForm');
  var success = document.getElementById('bookingSuccess');
  var error = document.getElementById('bookingError');
  var closeBtn = overlay.querySelector('.modal-close');
  var WHATSAPP_URL = 'https://wa.me/79894733754';

  var PRICES = {
    '5-дневный классический тур': 45000,
    'Экспресс-тур в Дагестан (3 дня)': 30000,
    'Горы и море (7 дней)': 50000,
    'Молодёжный тур (5 дней)': 60000,
    'Экскурсия: Дербент и экраноплан Лунь': 4000,
    'Экскурсия: Гоор и Язык Тролля': 4500,
    'Экскурсия: Самурский лес и Хучнинский водопад': 5500,
    'Экскурсия: Сулакский каньон и бархан Сарыкум': 4300,
    'Экскурсия: Хунзах, Матлас и водопады': 4000,
    'Экскурсия: Экскурсия по Махачкале': 3500
  };

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

  function formatPrice(n) {
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }

  function selectedPrice() {
    var tour = getValue('tour');
    return PRICES[tour] || 0;
  }

  function selectedPeople() {
    var v = parseInt(getValue('people'), 10);
    return isNaN(v) || v < 1 ? 0 : v;
  }

  function buildTotal() {
    var price = selectedPrice();
    if (!price) {
      total.innerHTML = '';
      return;
    }

    var people = selectedPeople();
    if (!people) {
      total.innerHTML = 'Стоимость: <b>от ' + formatPrice(price) + ' &#8381;</b> <span>за человека</span>';
      return;
    }

    total.innerHTML =
      'Стоимость: <b>от ' + formatPrice(price * people) + ' &#8381;</b>' +
      ' <span>(' + formatPrice(price) + ' &#8381; &#215; ' + people + ' чел.)</span>';
  }

  function buildMessage() {
    var lines = ['Здравствуйте! Хочу забронировать тур.', ''];
    lines.push('Имя: ' + getValue('name'));
    lines.push('Контакт: ' + getValue('contact'));

    var tour = getValue('tour');
    if (tour) lines.push('Маршрут: ' + tour);

    var date = getValue('date');
    if (date) lines.push('Дата поездки: ' + date);

    var people = selectedPeople();
    var price = selectedPrice();
    if (people) {
      lines.push('Количество людей: ' + people);
      if (price) lines.push('Стоимость (оценка): от ' + formatPrice(price * people) + ' руб. (' + formatPrice(price) + ' руб. x ' + people + ')');
    } else if (price) {
      lines.push('Стоимость (оценка): от ' + formatPrice(price) + ' руб. за человека');
    }

    var comment = getValue('comment');
    if (comment) lines.push('Комментарий: ' + comment);

    return lines.join('\n');
  }

  if (form) {
    var total = document.createElement('div');
    total.className = 'booking-total';
    total.setAttribute('aria-live', 'polite');
    var submitBtn = form.querySelector('.modal-submit');
    if (submitBtn) {
      submitBtn.insertAdjacentElement('beforebegin', total);
    }

    form.addEventListener('input', function (e) {
      if (e.target && e.target.name === 'people') {
        buildTotal();
      }
    });

    form.addEventListener('change', function (e) {
      if (e.target && e.target.name === 'tour') {
        buildTotal();
      }
    });

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

      submitBtn.disabled = true;

      setTimeout(function () {
        close();
        setTimeout(function () {
          form.reset();
          success.classList.remove('show');
          submitBtn.disabled = false;
          buildTotal();
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
