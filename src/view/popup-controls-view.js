import AbstractView from './abstract-view.js';

const createPopupControlsTemplate = (userDetails) => (
  `<section class="film-details__controls">
    <button type="button" class="film-details__control-button film-details__control-button--watchlist ${userDetails.watchList ? 'film-details__control-button--active' : ''}" id="watchlist" name="watchlist">
      ${userDetails.watchList ? 'Added to watchlist' : 'Add to watchlist'}
    </button>
    <button type="button" class="film-details__control-button film-details__control-button--watched ${userDetails.alreadyWatched ? 'film-details__control-button--active' : ''}" id="watched" name="watched">
      ${userDetails.alreadyWatched ? 'Already watched' : 'Not watched yet'}
    </button>
    <button type="button" class="film-details__control-button film-details__control-button--favorite ${userDetails.favorite ? 'film-details__control-button--active' : ''}" id="favorite" name="favorite">
      ${userDetails.favorite ? 'Added to favorites' : 'Add to favorites'}
    </button>
  </section>`
);

export default class PopupControlsView extends AbstractView {
  #userDetails = null;

  constructor(userDetails) {
    super();
    this.#userDetails = userDetails;
  }

  get template() {
    return createPopupControlsTemplate(this.#userDetails);
  }
}
