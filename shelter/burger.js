const BURGER = document.getElementsByClassName('burger__img')[0];
const menuBlock = document.getElementById('menu-block');
const MENU = document.getElementsByClassName('header__menu')[0];
const MENU_ELEMENTS = Array.from(document.getElementsByClassName('menu-link'));
const MENU_ELEMENTS_DISABLED = Array.from(document.getElementsByClassName('disabled'));
const LOGO = document.getElementsByClassName('logo')[0];
const LOGO2 = document.getElementsByClassName('logo2')[0];

const BURGER_APP = {
  hideMenu() {
    MENU.classList.add('header__menu_hide');
    BURGER.classList.remove('burger__img_active');
    setTimeout(() => {
      MENU.classList.remove('header__menu_show');
    }, 250);
    menuBlock.classList.add('hidden');
    LOGO.classList.remove('hidden');
    LOGO2.classList.add('hidden');
  },

  showMenu() {
    MENU.classList.add('header__menu_show');
    BURGER.classList.add('burger__img_active');
    setTimeout(() => {
      MENU.classList.remove('header__menu_hide');
    }, 10);
    menuBlock.classList.remove('hidden');
    LOGO.classList.add('hidden');
    LOGO2.classList.remove('hidden');
  },
};

BURGER.addEventListener('click', () => {
  if (BURGER.classList.contains('burger__img_active')) {
    BURGER_APP.hideMenu();
  } else {
    BURGER_APP.showMenu();
  }
});

// On window resize close burger menu
window.onresize = () => {
  BURGER_APP.hideMenu();
};

MENU_ELEMENTS_DISABLED.forEach((a) => {
  a.addEventListener('click', () => false);
});

// Close menu on li click
MENU_ELEMENTS.forEach((a) => {
  a.addEventListener('click', () => {
    if (a.classList.contains('disabled')) {
      return false;
    } setTimeout(() => {
      BURGER_APP.hideMenu();
    }, 50);
    return true;
  });
});
