import AbstractView from './abstract-view.js';

const createMenuTemplate = () => (
  `<nav class="main-navigation">
  </nav>`
);

export default class MenuView extends AbstractView {
  get template() {
    return createMenuTemplate();
  }

  setClickHandler = (callback) => {
    this._callback.menuClick = callback;
    this.element.addEventListener('click', this.#menuClickHandler);
  }

  #menuClickHandler = (evt) => {
    if (evt.target.tagName !== 'A') {
      return;
    }

    evt.preventDefault();
    this._callback.menuClick(evt.target.dataset.menuItem);
  }
}
