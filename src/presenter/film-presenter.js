import PopupView from '../view/popup-view.js';
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
  #newComment = null;

  #popupMode = PopupMode.POPUP_CLOSE;

  #changeData = null;
  #changeMode = null;

  #popupComponent = null;

  #scrollPopup = null;

  constructor (filmsListContainer, changeData, changeMode) {
    this.#filmsListContainer = filmsListContainer;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
  }

  init = (film, newComment) => {
    this.#film = film;
    this.#newComment = newComment;

    const prevFilmComponent = this.#filmComponent;

    this.#filmComponent = new FilmView(film, newComment);
    this.#filmComponent.setClickHandler(() => {
      this.#renderPopup(film, this.#scrollPopup);
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

  #renderPopup = (film, scrollPopup) => {
    this.#popupMode = PopupMode.POPUP_OPEN;
    this.#changeMode();
    document.body.classList.add('hide-overflow');
    document.addEventListener('keydown', this.#onEscKeyDown);

    this.#popupComponent = new PopupView(film);
    renderElement(document.body, this.#popupComponent);

    this.popupElement = this.#popupComponent.element;
    this.popupElement.scrollBy(0, scrollPopup);

    const popupCloseContainer = document.body.querySelector('.film-details__close');
    const popupCloseButtonComponent = new PopupCloseButtonView();
    renderElement(popupCloseContainer, popupCloseButtonComponent);

    popupCloseButtonComponent.setClickHandler(() => this.#onClose());

    this.#popupComponent.setWatchListClickHandler(() => this.#buttonWatchListClickHandler());

    this.#popupComponent.setWatchedClickHandler(() => this.#buttonWatchedClickHandler());

    this.#popupComponent.setFavoriteClickHandler(() => this.#buttonFavoriteClickHandler());
  }

  resetView = () => {
    if (this.#popupMode !== PopupMode.POPUP_CLOSE) {
      this.#onClose();
    }
  }

  #onClose = () => {
    removeComponent(this.#popupComponent);
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
    this.#updateFilmControls(changeUserDetails);
  }

  #buttonWatchedClickHandler = () => {
    const changeUserDetails = {...this.#film.userDetails, alreadyWatched: !this.#film.userDetails.alreadyWatched };
    this.#updateFilmControls(changeUserDetails);
  }

  #buttonFavoriteClickHandler = () => {
    const changeUserDetails = {...this.#film.userDetails, favorite: !this.#film.userDetails.favorite };
    this.#updateFilmControls(changeUserDetails);
  }

  #updateFilmControls = (changeUserDetails) => {
    const updateFilm = {...this.#film, userDetails: changeUserDetails};
    this.#changeData(updateFilm);
    this.scrollPopup = this.#popupComponent.scrollPosition;
    this.#renderPopup(updateFilm, this.scrollPopup);
  }
}
