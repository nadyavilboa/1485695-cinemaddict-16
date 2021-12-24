import SmartView from './smart-view.js';

const BLANK_CONTROLS = {
  watchList: false,
  alreadyWatched: false,
  favorite: false,
};

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

export default class PopupControlsView extends SmartView {
  #changeFilmCardWatchList = null;
  #changeFilmCardWatched = null;
  #changeFilmCardFavorite = null;

  constructor(userDetails = BLANK_CONTROLS, changeFilmCardWatchList, changeFilmCardWatched, changeFilmCardFavorite) {
    super();

    this._data = PopupControlsView.parseControlsToData(userDetails);

    this.#changeFilmCardWatchList = changeFilmCardWatchList;
    this.#changeFilmCardWatched = changeFilmCardWatched;
    this.#changeFilmCardFavorite = changeFilmCardFavorite;

    this.#setInnerHandlers();
  }

  get template() {
    return createPopupControlsTemplate(this._data);
  }

  restoreHandlers = () => {
    this.#setInnerHandlers();
  }

  #setInnerHandlers = () => {
    this.element.querySelector('.film-details__control-button--watchlist')
      .addEventListener('click', this.#watchListClickHandler);
    this.element.querySelector('.film-details__control-button--watched')
      .addEventListener('click', this.#watchedClickHandler);
    this.element.querySelector('.film-details__control-button--favorite')
      .addEventListener('click', this.#favoriteClickHandler);
  }

  #watchListClickHandler = (evt) => {
    evt.preventDefault();
    this.updateData({watchList: !this._data.watchList});
    PopupControlsView.parseDataToControls(this._data);
    this.#changeFilmCardWatchList();
  }

  #watchedClickHandler = (evt) => {
    evt.preventDefault();
    this.updateData({alreadyWatched: !this._data.alreadyWatched});
    PopupControlsView.parseDataToControls(this._data);
    this.#changeFilmCardWatched();
  }

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this.updateData({favorite: !this._data.favorite});
    PopupControlsView.parseDataToControls(this._data);
    this.#changeFilmCardFavorite();
  }

  static parseControlsToData = (userDetails) => ({...userDetails});

  static parseDataToControls = (data) => {
    const userDetails = {...data};

    return userDetails;
  };
}
