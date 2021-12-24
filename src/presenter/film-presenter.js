import PopupContainerView from '../view/popup-container-view.js';
import FilmView from '../view/film-view.js';
import { renderElement, removeComponent, replace } from '../utils/render.js';
import { isEscapeEvent } from '../utils/common.js';

const PopupMode = {
  POPUP_CLOSE: 'CLOSE',
  POPUP_OPEN: 'OPEN',
};

export default class FilmPresenter {
  #filmsListContainer = null;
  #filmComponent = null;
  #film = null;

  #popupMode = PopupMode.POPUP_CLOSE;

  #changeData = null;
  #changeMode = null;

  #popupContainerComponent = null;

  constructor (filmsListContainer, changeData, changeMode) {
    this.#filmsListContainer = filmsListContainer;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
  }

  init = (film) => {
    this.#film = film;

    const prevFilmComponent = this.#filmComponent;

    this.#filmComponent = new FilmView(film);
    this.#filmComponent.setClickHandler(() => {
      this.#renderPopup(film, this.#changeFilmCardWatchList, this.#changeFilmCardWatched, this.#changeFilmCardFavorite);
    });

    this.#filmComponent.setWatchListClickHandler(this.#changeFilmCardWatchList);
    this.#filmComponent.setWatchedClickHandler(this.#changeFilmCardWatched);
    this.#filmComponent.setFavoriteClickHandler(this.#changeFilmCardFavorite);

    if (prevFilmComponent === null) {
      renderElement(this.#filmsListContainer, this.#filmComponent);
    } else {
      replace(this.#filmComponent, prevFilmComponent);
    }

    removeComponent(prevFilmComponent);
  }

  destroy = () => {
    removeComponent(this.#filmComponent);
  }

  #renderPopup = (film, watchListPopupClickHandler, watchedPopupClickHandler, favoriteClickHandler) => {
    this.#popupMode = PopupMode.POPUP_OPEN;
    this.#changeMode();
    document.body.classList.add('hide-overflow');
    document.addEventListener('keydown', this.#onEscKeyDown);

    this.#popupContainerComponent = new PopupContainerView(film, watchListPopupClickHandler, watchedPopupClickHandler, favoriteClickHandler);
    renderElement(document.body, this.#popupContainerComponent);

    this.#popupContainerComponent.setCloseClickHandler(this.#closePopup);
  }

  resetView = () => {
    if (this.#popupMode !== PopupMode.POPUP_CLOSE) {
      this.#closePopup();
    }
  }

  #closePopup = () => {
    removeComponent(this.#popupContainerComponent);
    document.body.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this.#onEscKeyDown);
  }

  #onEscKeyDown = ({key}) => {
    if (isEscapeEvent(key)) {
      this.#closePopup();
    }
  }

  #changeFilmCardWatchList = () => {
    this.#changeData({...this.#film, userDetails: {...this.#film.userDetails, watchList: !this.#film.userDetails.watchList }});
  }

  #changeFilmCardWatched = () => {
    this.#changeData({...this.#film, userDetails: {...this.#film.userDetails, alreadyWatched: !this.#film.userDetails.alreadyWatched }})
  }

  #changeFilmCardFavorite = () => {
    this.#changeData({...this.#film, userDetails: {...this.#film.userDetails, favorite: !this.#film.userDetails.favorite }});
  }
}
