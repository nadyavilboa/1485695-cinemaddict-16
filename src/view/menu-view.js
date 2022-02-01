import AbstractView from './abstract-view.js';

const createMenuTemplate = () => (
  `<nav class="main-navigation">
  </nav>`
);

export default class MenuView extends AbstractView {
  #callbacks = [];

  get template() {
    return createMenuTemplate();
  }

  setClickHandler = (callback) => {
    this.#callbacks.push(callback);
    this.element.addEventListener('click', this.#menuClickHandler);
  }

  #menuClickHandler = (evt) => {
    if (evt.target.tagName !== 'A' && evt.target.tagName !== 'SPAN') {
      return;
    }

    evt.preventDefault();

    if (evt.target.tagName === 'SPAN') {
      this.#callbacks.forEach((cb) => cb(evt.target.parentNode.dataset.menuItem));
      return;
    }

    this.#callbacks.forEach((cb) => cb(evt.target.dataset.menuItem));
  }
}
