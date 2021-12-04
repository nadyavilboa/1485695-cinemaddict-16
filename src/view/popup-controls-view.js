import { createElement } from '../render.js';

const createPopupControlsTemplate = (userDetails) => (
  `<section class="film-details__controls">
    <button type="button" class="film-details__control-button film-details__control-button--watchlist ${userDetails.watchlist ? 'film-details__control-button--active' : ''}" id="watchlist" name="watchlist">${userDetails.watchlist ? 'Added to watchlist' : 'Add to watchlist'}</button>
    <button type="button" class="film-details__control-button film-details__control-button--watched ${userDetails.watched ? 'film-details__control-button--active' : ''}" id="watched" name="watched">${userDetails.watched ? 'Already watched' : 'Not watched yet'}</button>
    <button type="button" class="film-details__control-button film-details__control-button--favorite ${userDetails.favorite ? 'film-details__control-button--active' : ''}" id="favorite" name="favorite">${userDetails.favorite ? 'Added to favorites' : 'Add to favorites'}</button>
  </section>`
);

export default class PopupControlsView {
  #element = null;
  #userDetails = null;

  constructor(userDetails) {
    this.#userDetails = userDetails;
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createPopupControlsTemplate(this.#userDetails);
  }

  removeElement() {
    this.#element = null;
  }
}
