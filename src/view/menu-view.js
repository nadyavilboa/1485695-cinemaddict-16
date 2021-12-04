import { createElement } from '../render.js';

const createFilterItemTemplate = (name, count) => (
  `<a href="#${name}" class="main-navigation__item">${name.charAt(0).toUpperCase() + name.slice(1)}
    <span class="main-navigation__item-count">${count}</span>
  </a>`
);

const createMenuTemplate = (filters) => {
  const filtersMarkup = Object.entries(filters).map(([name, count]) => createFilterItemTemplate(name, count)).join(' ');

  return (
    `<div class="main-navigation__items">
      <a href="#allMovies" class="main-navigation__item main-navigation__item--active">All movies</a>
      ${filtersMarkup}
    </div>`
  );
};

export default class MenuView {
  #element = null;
  #filters = null;

  constructor(filters) {
    this.#filters = filters;
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createMenuTemplate(this.#filters);
  }

  removeElement() {
    this.#element = null;
  }
}
