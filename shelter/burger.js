const BURGER = document.getElementsByClassName('burger__img')[0];
const menuBlock = document.getElementById('menu-block');
const MENU = document.getElementsByClassName('header__menu')[0];
const LOGO = document.getElementsByClassName('logo')[0];
const HEADER = document.getElementsByTagName('header')[0];

hideMenu = () => {
  MENU.classList.add('header__menu_hide');
  BURGER.classList.remove('burger__img_active');
  setTimeout(() => {
    MENU.classList.remove('header__menu_show');
  }, 250);
  menuBlock.classList.add('hidden');
  LOGO.classList.remove('hidden');
}

showMenu = () => {
  MENU.classList.add('header__menu_show');
  BURGER.classList.add('burger__img_active');
  setTimeout(() => {
    MENU.classList.remove('header__menu_hide');
  }, 10);
  menuBlock.style.setProperty('height', document.querySelector('body').scrollHeight + 'px');
  menuBlock.classList.remove('hidden');
  LOGO.classList.add('hidden');
}

BURGER.addEventListener('click', () => {
  if (BURGER.classList.contains('burger__img_active')) {
    hideMenu();
  } else {
    showMenu();
  }
})

// On window resize close burger menu
window.onresize = (event) => {
  hideMenu();
};