import AbstractView from './abstract-view.js';

const createFilterItemTemplate = (type, name, count, activeFilter) => (
  `<a
    href="#${type}"
    data-menu-item="${type}"
    class="main-navigation__item ${type === activeFilter ? 'main-navigation__item--active' : ''}"
  >
    ${name.charAt(0).toUpperCase() + name.slice(1)}
    ${count ? `<span class="main-navigation__item-count">${count}</span>` : ''}
  </a>`
);

const createFiltersTemplate = (filters, activeFilter) => {
  const filtersMarkup = filters.map(({ type, name, count }) => createFilterItemTemplate(type, name, count, activeFilter)).join(' ');

  return (
    `<div style="display: flex; width: 100%">
      <div class="main-navigation__items">
        ${filtersMarkup}
      </div>
      <a href="#stats" class="main-navigation__additional" data-menu-item="stats">
        Stats
      </a>
    </div>`
  );
};

export default class FiltersView extends AbstractView {
  #filters = null;
  #activeFilter = null;

  constructor(filters, activeFilter) {
    super();
    this.#filters = filters;
    this.#activeFilter = activeFilter;
  }

  get template() {
    return createFiltersTemplate(this.#filters, this.#activeFilter);
  }
}
