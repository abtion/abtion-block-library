const body = document.body;
const openBtn = document.getElementById('openDrawer');
const closeBtn = document.getElementById('closeDrawer');
const drawer = document.getElementById('drawer');
const backdrop = document.getElementById('drawerBackdrop');

let lastFocused;

function open() {
  lastFocused = document.activeElement;
  body.classList.add('drawer-open');
  drawer.hidden = backdrop.hidden = false;
  body.style.overflow = 'hidden'; // scroll lock
  document.documentElement.inert = true; // background inert (modern)
  drawer.inert = false;
  drawer.querySelector('h2,button,[href],input,select,textarea')?.focus();
}

function close() {
  body.classList.remove('drawer-open');
  body.style.overflow = '';
  document.documentElement.inert = false;
  drawer.hidden = backdrop.hidden = true;
  lastFocused?.focus();
}

openBtn.addEventListener('click', open);
closeBtn.addEventListener('click', close);
backdrop.addEventListener('click', close);
window.addEventListener('keydown', e => e.key === 'Escape' && close());
