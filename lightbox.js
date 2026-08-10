(function () {
  var overlay = null;
  var currentImages = [];
  var currentIndex = 0;

  function ensureOverlay() {
    if (overlay) return;

    overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-hidden', 'true');
    overlay.innerHTML =
      '<button class="lightbox-close" type="button" aria-label="Закрыть">&times;</button>' +
      '<button class="lightbox-nav lightbox-prev" type="button" aria-label="Назад">' +
      '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>' +
      '</button>' +
      '<figure class="lightbox-figure">' +
      '<img src="" alt="">' +
      '<figcaption class="lightbox-caption"></figcaption>' +
      '</figure>' +
      '<button class="lightbox-nav lightbox-next" type="button" aria-label="Вперёд">' +
      '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>' +
      '</button>';
    document.body.appendChild(overlay);

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) close();
    });

    overlay.querySelector('.lightbox-close').addEventListener('click', close);
    overlay.querySelector('.lightbox-prev').addEventListener('click', function () {
      show(currentIndex - 1);
    });
    overlay.querySelector('.lightbox-next').addEventListener('click', function () {
      show(currentIndex + 1);
    });

    document.addEventListener('keydown', function (e) {
      if (!overlay.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(currentIndex - 1);
      if (e.key === 'ArrowRight') show(currentIndex + 1);
    });
  }

  function show(i) {
    if (!currentImages.length) return;
    currentIndex = (i + currentImages.length) % currentImages.length;

    var img = overlay.querySelector('img');
    img.src = currentImages[currentIndex].src;
    img.alt = currentImages[currentIndex].alt || '';

    var caption = overlay.querySelector('.lightbox-caption');
    caption.textContent =
      (currentImages[currentIndex].alt || 'Фото') +
      ' — ' + (currentIndex + 1) + ' / ' + currentImages.length;
  }

  function open(images, index) {
    ensureOverlay();
    currentImages = images;
    currentIndex = index;
    show(currentIndex);
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    if (!overlay) return;
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function bindGrid(grid) {
    var images = Array.prototype.slice.call(grid.querySelectorAll('img'));
    if (!images.length) return;

    images.forEach(function (img, i) {
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', function () {
        open(images, i);
      });
    });
  }

  document.querySelectorAll('.features-grid, .gallery-grid').forEach(bindGrid);
})();
