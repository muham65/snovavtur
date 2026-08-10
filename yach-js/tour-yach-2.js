const headers = document.querySelectorAll('.accordion-header');

headers.forEach(header => {
  header.addEventListener('click', function () {
    this.parentElement.classList.toggle('active');
  });
});

const burger = document.querySelector('.burger');
const nav = document.querySelector('.header-div1');

function openMenu() {
    burger.classList.add('active');
    nav.classList.add('open');
    burger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
}

function closeMenu() {
    burger.classList.remove('active');
    nav.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
}

if (burger && nav) {
    burger.addEventListener('click', (e) => {
        e.stopPropagation();
        if (burger.classList.contains('active')) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    document.addEventListener('click', (e) => {
        if (burger.classList.contains('active') && !nav.contains(e.target) && !burger.contains(e.target)) {
            closeMenu();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && burger.classList.contains('active')) {
            closeMenu();
        }
    });

    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });
}

