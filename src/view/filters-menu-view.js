import AbstractView from './abstract-view.js';

const createFilterItemTemplate = (name, count) => (
  `<a href="#${name}" class="main-navigation__item" data-menu-item="${name}">
    ${name.charAt(0).toUpperCase() + name.slice(1)}
    <span class="main-navigation__item-count">${count}</span>
  </a>`
);

const createMenuTemplate = (filters) => {
  const filtersMarkup = Object.entries(filters).map(([name, count]) => createFilterItemTemplate(name, count)).join(' ');

  return (
    `<div class="main-navigation__items">
      ${filtersMarkup}
    </div>`
  );
};

export default class MenuView extends AbstractView {
  #filters = null;

  constructor(filters) {
    super();
    this.#filters = filters;
  }

  get template() {
    return createMenuTemplate(this.#filters);
  }

  setFilterClickHandler = (callback) => {
    this._callback.filterClick = callback;
    this.element.addEventListener('click', this.#filterClickHandler);
  }

  #filterClickHandler = (evt) => {
    if (evt.target.tagName !== 'A') {
      return;
    }

    evt.preventDefault();
    this._callback.filterClick(evt.target.dataset.menuItem);
  }
}
