import SmartView from './smart-view.js';
import { ControlType } from '../const.js';

const createPopupControlsTemplate = ({watchList, alreadyWatched, favorite}) => (
  `<section class="film-details__controls">
    <button
      type="button"
      class="film-details__control-button film-details__control-button--watchlist ${watchList ? 'film-details__control-button--active' : ''}"
      id="watchlist"
      name="watchlist"
    >
      ${watchList ? 'Added to watchlist' : 'Add to watchlist'}
    </button>
    <button
      type="button"
      class="film-details__control-button film-details__control-button--watched ${alreadyWatched ? 'film-details__control-button--active' : ''}"
      id="watched"
      name="watched"
    >
      ${alreadyWatched ? 'Already watched' : 'Not watched yet'}
    </button>
    <button
      type="button"
      class="film-details__control-button film-details__control-button--favorite ${favorite ? 'film-details__control-button--active' : ''}"
      id="favorite"
      name="favorite"
    >
      ${favorite ? 'Added to favorites' : 'Add to favorites'}
    </button>
  </section>`
);

export default class PopupControlsView extends SmartView {
  #updateFilmCard = null;

  constructor(userDetails, updateFilmCard) {
    super();

    this._data = PopupControlsView.parseControlsToData(userDetails);

    this.#updateFilmCard = updateFilmCard;

    this.#setHandler();
  }

  get template() {
    return createPopupControlsTemplate(this._data);
  }

  restoreHandlers = () => {
    this.#setHandler();
  }

  #setHandler = () => {
    this.element.addEventListener('click', this.#controlClickHandler);
  }

  #controlClickHandler = (evt) => {
    evt.preventDefault();

    if (!evt.target.closest('.film-details__control-button')) {
      return;
    }

    switch (evt.target.id) {
      case ControlType.WATCHLIST:
        this._data = {...this._data, watchList: !this._data.watchList};
        break;
      case ControlType.ALREADY_WATCHED:
        this._data = {...this._data, alreadyWatched: !this._data.alreadyWatched};
        break;
      case ControlType.FAVORITE:
        this._data = {...this._data, favorite: !this._data.favorite};
        break;
      default:
        throw new Error(`Unknown control type ${evt.target.id}`);
    }

    this.updateData(this._data);
    this.#updateFilmCard(this._data);
  }

  static parseControlsToData = (userDetails) => ({...userDetails});
}
