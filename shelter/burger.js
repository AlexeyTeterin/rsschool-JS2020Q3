const BURGER = document.getElementsByClassName('burger__img')[0];
const menuBlock = document.getElementById('menu-block');
const MENU = document.getElementsByClassName('header__menu')[0];
const MENU_ELEMENTS = Array.from(document.getElementsByClassName('menu-link'));
const MENU_ELEMENTS_DISABLED = Array.from(document.getElementsByClassName('disabled'));
const LOGO = document.getElementsByClassName('logo')[0];
const LOGO2 = document.getElementsByClassName('logo2')[0];

const stopScroll = () => {
  const x = window.scrollX;
  const y = window.scrollY;
  window.onscroll = () => window.scrollTo(x, y);
};

const hideMenu = () => {
  BURGER.classList.remove('burger__img_active');
  MENU.classList.add('header__menu_hide');
  menuBlock.classList.add('hidden');
  LOGO.classList.remove('hidden');
  LOGO2.classList.add('hidden');
  window.onscroll = () => {};
};

const showMenu = () => {
  MENU.classList.add('header__menu_show');
  BURGER.classList.add('burger__img_active');
  setTimeout(() => {
    MENU.classList.remove('header__menu_hide');
  }, 10);
  menuBlock.style.setProperty('height', `${document.querySelector('body').scrollHeight}px`);
  menuBlock.classList.remove('hidden');
  LOGO.classList.add('hidden');
  LOGO2.classList.remove('hidden');
  stopScroll();
};

// Open/close burger-menu
BURGER.addEventListener('click', () => {
  if (BURGER.classList.contains('burger__img_active')) {
    hideMenu();
  } else {
    showMenu();
  }
});

// On window resize close burger menu
window.onresize = () => {
  hideMenu();
};

// Ignore disabled links
MENU_ELEMENTS_DISABLED.forEach((a) => {
  a.addEventListener('click', () => false);
});

// Close menu on li click
MENU_ELEMENTS.forEach((a) => {
  a.addEventListener('click', () => {
    if (a.classList.contains('disabled')) return false;
    window.onscroll = () => {};
    setTimeout(() => {
      hideMenu();
    }, 100);
  });
});
