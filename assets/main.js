'use strict';
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.nav');
function closeMenu() {
  navigation?.classList.remove('is-open');
  menuButton?.setAttribute('aria-expanded', 'false');
  menuButton?.setAttribute('aria-label', 'Открыть меню');
}
menuButton?.addEventListener('click', () => {
  const opened = navigation.classList.toggle('is-open');
  menuButton.setAttribute('aria-expanded', String(opened));
  menuButton.setAttribute('aria-label', opened ? 'Закрыть меню' : 'Открыть меню');
});
navigation?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuButton?.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menuButton.focus();
  }
});
document.addEventListener('click', event => {
  if (!event.target.closest('.header')) closeMenu();
});
window.matchMedia('(min-width: 801px)').addEventListener('change', event => {
  if (event.matches) closeMenu();
});
const serviceNames = {
  'web-development': 'Разработка сайтов',
  'mobile-apps': 'Мобильные приложения',
  'enterprise-solutions': 'Корпоративные ИТ-решения',
  'computers': 'Компьютеры и рабочие станции',
  'servers-storage': 'Серверы и системы хранения',
  'implementation': 'Настройка и запуск',
  'support': 'Сервисное обслуживание'
};
const requestForm = document.getElementById('request-form');
const selectedService = new URLSearchParams(window.location.search).get('service');
if (requestForm && serviceNames[selectedService]) {
  requestForm.elements.direction.value = serviceNames[selectedService];
}
let requestText = '';
requestForm?.addEventListener('submit', event => {
  event.preventDefault();
  if (!requestForm.reportValidity()) return;
  const data = new FormData(requestForm);
  requestText = [
    'Здравствуйте, APP PARTNERS!', '',
    `Имя: ${data.get('name').trim()}`,
    `Компания: ${data.get('company').trim() || 'Не указана'}`,
    `Контакт для ответа: ${data.get('contact').trim()}`,
    `Направление: ${data.get('direction')}`, '',
    'Задача:', data.get('message').trim()
  ].join('\n');
  const subject = `Запрос с сайта: ${data.get('direction')}`;
  document.getElementById('form-result').hidden = false;
  window.location.href = `mailto:Sale@apppartners.kz?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(requestText)}`;
});
document.getElementById('copy-request')?.addEventListener('click', async event => {
  const button = event.currentTarget;
  try {
    await navigator.clipboard.writeText(requestText);
    button.textContent = 'Текст скопирован';
  } catch {
    let textArea = document.getElementById('request-copy-fallback');
    if (!textArea) {
      textArea = document.createElement('textarea');
      textArea.id = 'request-copy-fallback';
      textArea.readOnly = true;
      textArea.setAttribute('aria-label', 'Текст обращения — выделите и скопируйте');
      document.getElementById('form-result').append(textArea);
    }
    textArea.value = requestText;
    textArea.focus();
    textArea.select();
    button.textContent = 'Выделите и скопируйте текст ниже';
  }
});
