import FiltersMenuView from '../view/filters-menu-view.js';
import { renderElement, replace, removeComponent } from '../utils/render.js';
import { MenuItem, UpdateType } from '../const.js';
import { countFiltersValue } from '../utils/film.js';
import { countFilters } from '../main.js';

export default class FilterPresenter {
  #menuContainer = null;
  #filterModel = null;
  #filmsModel = null;

  #filtersMenuComponent = null;

  constructor(menuContainer, filmsModel, filterModel,) {
    this.#menuContainer = menuContainer;
    this.#filterModel = filterModel;
    this.#filmsModel = filmsModel;
  }

  get filter() {
    const films = this.#filmsModel.films;

    return [
      {
        type: MenuItem.ALL_MOVIES,
        name: 'All movies',
        count: countFiltersValue(films).allMovies,
      },
      {
        type: MenuItem.WATCHLIST,
        name: 'Watchlist',
        count: countFiltersValue(films).watchlist,
      },
      {
        type: MenuItem.HISTORY,
        name: 'History',
        count: countFiltersValue(films).history,
      },
      {
        type: MenuItem.FAVORITES,
        name: 'Favorites',
        count: countFiltersValue(films).favorites,
      },
    ];
  }

  init = () => {
    const prevFiltersMenuComponent = this.#filtersMenuComponent;

    this.#filtersMenuComponent = new FiltersMenuView(countFilters, this.#filterModel.filter);
    this.#menuContainer.setMenuClickHandler(this.#handleFilterTypeChange);

    this.#filmsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);

    if (!prevFiltersMenuComponent) {
      renderElement(this.#menuContainer, this.#filtersMenuComponent);
      return;
    }

    replace(this.#filtersMenuComponent, prevFiltersMenuComponent);
    removeComponent(prevFiltersMenuComponent);
  }

  destroy = () => {
    removeComponent(this.#filtersMenuComponent);
    this.#filtersMenuComponent = null;

    this.#filmsModel.removeObserver(this.#handleModelEvent);
    this.#filterModel.removeObserver(this.#handleModelEvent);

    this.#filterModel.setFilter(UpdateType.MINOR_BIG_LIST, MenuItem.ALL_MOVIES);

    this.#menuContainer = null;
    this.#filterModel = null;
    this.#filmsModel = null;
  }

  #handleModelEvent = () => {
    this.init();
  }

  #handleFilterTypeChange = (menuItem) => {
    if (this.#filterModel.filter === menuItem) {
      return;
    }

    this.#filterModel.setFilter(UpdateType.MINOR_BIG_LIST, menuItem);
  }

}
