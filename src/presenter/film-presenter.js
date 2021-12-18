import PopupContainerView from '../view/popup-container-view.js';
import PopupCloseButtonView from '../view/popup-close-button-view.js';
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
  #popupCloseButton = null;

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
      this.#renderPopup(film);
    });

    this.#filmComponent.setWatchListClickHandler(() => {
      const changeUserDetails = {...this.#film.userDetails, watchList: !this.#film.userDetails.watchList };
      this.#changeData({...this.#film, userDetails: changeUserDetails});
    });

    this.#filmComponent.setWatchedClickHandler(() => {
      const changeUserDetails = {...this.#film.userDetails, alreadyWatched: !this.#film.userDetails.alreadyWatched };
      this.#changeData({...this.#film, userDetails: changeUserDetails});
    });

    this.#filmComponent.setFavoriteClickHandler(() => {
      const changeUserDetails = {...this.#film.userDetails, favorite: !this.#film.userDetails.favorite };
      this.#changeData({...this.#film, userDetails: changeUserDetails});
    });

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

  #renderPopup = (film) => {
    this.#popupMode = PopupMode.POPUP_OPEN;
    this.#changeMode();
    document.body.classList.add('hide-overflow');
    document.addEventListener('keydown', this.#onEscKeyDown);

    this.#popupContainerComponent = new PopupContainerView(film);
    renderElement(document.body, this.#popupContainerComponent);

    this.#popupContainerComponent.setWatchListClickHandler(() => {
      this.#buttonWatchListClickHandler();
    });

    this.#popupContainerComponent.setWatchedClickHandler(() => {
      this.#buttonWatchedClickHandler();
    });

    this.#popupContainerComponent.setFavoriteClickHandler(() => {
      this.#buttonFavoriteClickHandler();
    });

    this.#renderPopupCloseButton();
  }

  #renderPopupCloseButton = () => {
    const buttonContainer = document.body.querySelector('.film-details__close');
    this.#popupCloseButton = new PopupCloseButtonView();
    renderElement(buttonContainer, this.#popupCloseButton);

    this.#popupCloseButton.setClickHandler(() => this.#onClose());
  }

  resetView = () => {
    if (this.#popupMode !== PopupMode.POPUP_CLOSE) {
      this.#onClose();
    }
  }

  #onClose = () => {
    removeComponent(this.#popupContainerComponent);
    document.body.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this.#onEscKeyDown);
  }

  #onEscKeyDown = ({key}) => {
    if (isEscapeEvent(key)) {
      this.#onClose();
    }
  }

  #buttonWatchListClickHandler = () => {
    const changeUserDetails = {...this.#film.userDetails, watchList: !this.#film.userDetails.watchList };
    this.#userDetailsComponentUpdate(changeUserDetails);
  }

  #buttonWatchedClickHandler = () => {
    const changeUserDetails = {...this.#film.userDetails, alreadyWatched: !this.#film.userDetails.alreadyWatched };
    this.#userDetailsComponentUpdate(changeUserDetails);
  }

  #buttonFavoriteClickHandler = () => {
    const changeUserDetails = {...this.#film.userDetails, favorite: !this.#film.userDetails.favorite };
    this.#userDetailsComponentUpdate(changeUserDetails);
  }

  #userDetailsComponentUpdate = (changeUserDetails) => {
    this.#changeData({...this.#film, userDetails: changeUserDetails});
    this.#popupContainerComponent.rerenderControls(changeUserDetails);

    document.body.querySelector('.film-details__control-button--watchlist')
      .addEventListener('click', this.#buttonWatchListClickHandler);

    document.body.querySelector('.film-details__control-button--watched')
      .addEventListener('click', this.#buttonWatchedClickHandler);

    document.body.querySelector('.film-details__control-button--favorite')
      .addEventListener('click', this.#buttonFavoriteClickHandler);
  }
}
