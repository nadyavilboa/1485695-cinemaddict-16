import PopupContainerView from '../view/popup-container-view.js';
import PopupCloseButtonView from '../view/popup-close-button-view.js';
import PopupControlsView from '../view/popup-controls-view.js';
import FilmView from '../view/film-view.js';
import { renderElement, removeComponent, replace } from '../utils/render.js';
import { isEscapeEvent } from '../utils/common.js';


export default class FilmPresenter {
  #filmsListContainer = null;
  #filmComponent = null;
  #film = null;

  #changeData = null;

  #popupContainerComponent = null;
  #popupCloseButton = null;
  #popupControls = null;
  #userDetailsComponent = null;

  constructor (filmsListContainer, changeData) {
    this.#filmsListContainer = filmsListContainer;
    this.#changeData = changeData;
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
    this.#onClose();
    document.body.classList.add('hide-overflow');
    document.addEventListener('keydown', this.#onEscKeyDown);

    this.#popupContainerComponent = new PopupContainerView(film);
    renderElement(document.body, this.#popupContainerComponent);

    this.#userDetailsComponent = document.body.querySelector('.film-details__controls');

    this.#popupContainerComponent.setWatchListClickHandler(() => {
      const changeUserDetails = {...this.#film.userDetails, watchList: !this.#film.userDetails.watchList };
      this.#userDetailsComponentUpdate(changeUserDetails);
    });

    this.#popupContainerComponent.setWatchedClickHandler(() => {
      const changeUserDetails = {...this.#film.userDetails, alreadyWatched: !this.#film.userDetails.alreadyWatched };
      this.#userDetailsComponentUpdate(changeUserDetails);
    });

    this.#popupContainerComponent.setFavoriteClickHandler(() => {
      const changeUserDetails = {...this.#film.userDetails, favorite: !this.#film.userDetails.favorite };
      this.#userDetailsComponentUpdate(changeUserDetails);
    });

    this.#renderPopupCloseButton();
  }

  #renderPopupCloseButton = () => {
    const buttonContainer = document.body.querySelector('.film-details__close');
    this.#popupCloseButton = new PopupCloseButtonView();
    renderElement(buttonContainer, this.#popupCloseButton);

    this.#popupCloseButton.setClickHandler(() => this.#onClose());
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

  #userDetailsComponentUpdate = (changeUserDetails) => {
    this.#changeData({...this.#film, userDetails: changeUserDetails});
    this.#popupControls = new PopupControlsView(changeUserDetails);
    replace(this.#popupControls, this.#userDetailsComponent);
  }
}
