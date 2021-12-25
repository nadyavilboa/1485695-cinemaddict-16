import { getActualRank } from '../utils/film.js';
import AbstractView from './abstract-view.js';

const createHeaderProfileTemplate = (rank) => (
  `<section class="header__profile profile">
    <p class="profile__rating">${rank}</p>
    <img
      class="profile__avatar"
      src="images/bitmap@2x.png"
      alt="Avatar"
      width="35"
      height="35"
    />
  </section>`
);

export default class HeaderProfileView extends AbstractView {
  #films = null;
  #filmsWatchedCount = null;
  #rank = null;

  constructor(filmsWatchedCount, films) {
    super();
    this.#filmsWatchedCount = filmsWatchedCount;
    this.#films = films;
  }

  get template() {
    if (this.#films.length > 0) {
      this.#rank = getActualRank(this.#filmsWatchedCount);
    } else {
      this.#rank = '';
    }
    return createHeaderProfileTemplate(this.#rank);
  }
}
