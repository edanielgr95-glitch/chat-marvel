import { renderHome } from './views/home.js';
import { renderChat } from './views/chat.js';
import { renderAbout } from './views/about.js';
import { renderNotFound } from './views/notFound.js';

const routes = {
  '/home': renderHome,
  '/chat': renderChat,
  '/about': renderAbout,
};

export function router() {
  if (window.location.pathname === '/') {
    history.replaceState(null, '', '/home');
  }

  const path = window.location.pathname;
  const render = routes[path] ?? renderNotFound;
  const app = document.querySelector('#app');

  render(app);
  updateActiveLink(path);
}

export function navigateTo(path) {
  if (path === window.location.pathname) return;
  history.pushState(null, '', path);
  router();
}

function updateActiveLink(path) {
  document.querySelectorAll('nav a').forEach((link) => {
    const isActive = link.getAttribute('href') === path;
    link.classList.toggle('active', isActive);
    if (isActive) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });
}