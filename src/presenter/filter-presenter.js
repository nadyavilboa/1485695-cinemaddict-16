import FiltersView from '../view/filters-view.js';
import { renderElement, replace, removeComponent } from '../utils/render.js';
import { MenuItem, UpdateType } from '../const.js';
import { countFiltersValue } from '../utils/film.js';

export default class FilterPresenter {
  #menuContainer = null;
  #filterModel = null;
  #filmsModel = null;

  #filtersComponent = null;

  constructor(menuContainer, filmsModel, filterModel) {
    this.#menuContainer = menuContainer;
    this.#filterModel = filterModel;
    this.#filmsModel = filmsModel;
  }

  get filters() {
    const films = this.#filmsModel.films;
    const filteredFilms = countFiltersValue(films);

    return [
      {
        type: MenuItem.ALL,
        name: 'All movies',
        count: null,
      },
      {
        type: MenuItem.WATCHLIST,
        name: 'Watchlist',
        count: filteredFilms.watchlist,
      },
      {
        type: MenuItem.HISTORY,
        name: 'History',
        count: filteredFilms.history,
      },
      {
        type: MenuItem.FAVORITES,
        name: 'Favorites',
        count: filteredFilms.favorites,
      },
    ];
  }

  init = () => {
    const filters = this.filters;
    const prevFiltersComponent = this.#filtersComponent;

    this.#filtersComponent = new FiltersView(filters, this.#filterModel.filter);
    this.#menuContainer.setClickHandler(this.#handleFilterTypeChange);

    this.#filmsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);

    if (!prevFiltersComponent) {
      renderElement(this.#menuContainer, this.#filtersComponent);
      return;
    }

    replace(this.#filtersComponent, prevFiltersComponent);
    removeComponent(prevFiltersComponent);
  }

  destroy = () => {
    removeComponent(this.#filtersComponent);
    this.#filtersComponent = null;

    this.#filmsModel.removeObserver(this.#handleModelEvent);
    this.#filterModel.removeObserver(this.#handleModelEvent);

    this.#filterModel.setFilter(UpdateType.MAJOR, MenuItem.ALL);

    this.#menuContainer = null;
    this.#filterModel = null;
    this.#filmsModel = null;
  }

  #handleModelEvent = () => {
    this.init();
  }

  #handleFilterTypeChange = (menuItem) => {
    if (this.#filterModel.filter === menuItem || menuItem === MenuItem.STATS) {
      return;
    }

    this.#filterModel.setFilter(UpdateType.MAJOR, menuItem);
  }

}
