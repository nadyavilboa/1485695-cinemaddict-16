import { renderElement, replace, removeComponent } from '../utils/render.js';
import HeaderProfileView from '../view/header-profile-view.js';
import { getActualRank, countFiltersValue } from '../utils/film.js';

export default class RatingPresenter {
  #headerElement = null;

  #filmsModel = null;

  #headerProfileElement = null;

  constructor(headerElement, filmsModel) {
    this.#headerElement = headerElement;
    this.#filmsModel = filmsModel;
  }

  get rating() {
    const films = this.#filmsModel.films;
    const rating = '';

    if (films.length > 0) {
      const filmsWatched = countFiltersValue(films).history;
      if (filmsWatched > 0) {
        return getActualRank(filmsWatched);
      }
    }

    return rating;
  }

  init = () => {
    const rating = this.rating;
    const prevHeaderProfileElement = this.#headerProfileElement;

    this.#headerProfileElement = new HeaderProfileView(rating);

    this.#filmsModel.addObserver(this.#handleModelEvent);

    if (!prevHeaderProfileElement) {
      renderElement(this.#headerElement, this.#headerProfileElement);
      return;
    }

    replace(this.#headerProfileElement, prevHeaderProfileElement);
    removeComponent(prevHeaderProfileElement);
  }

  destroy = () => {
    removeComponent(this.#headerProfileElement);
    this.#headerProfileElement = null;

    this.#filmsModel.removeObserver(this.#handleModelEvent);

    this.#headerElement = null;
    this.#filmsModel = null;
  }

  #handleModelEvent = () => {
    this.init();
  }
}
