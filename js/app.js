const keychain = document.querySelector('.keychain');
const keys = document.querySelectorAll('.key');
const keyList = document.querySelector('.keys');

const clearActive = () => {
  keychain.classList.remove('active');
  keys.forEach((key) => key.classList.remove('is-active'));
};

const setActive = (key) => {
  keychain.classList.add('active');
  keys.forEach((item) => item.classList.toggle('is-active', item === key));
};

keys.forEach((key) => {
  key.addEventListener('mouseenter', () => setActive(key));
  key.addEventListener('focus', () => setActive(key));
  key.addEventListener('click', () => setActive(key));
});

keyList.addEventListener('mouseleave', clearActive);
keyList.addEventListener('focusout', (event) => {
  if (!keyList.contains(event.relatedTarget)) {
    clearActive();
  }
});
