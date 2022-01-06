import PopupContainerView from '../view/popup-container-view.js';
import FilmView from '../view/film-view.js';
import { renderElement, removeComponent, replace } from '../utils/render.js';
import { UserAction, UpdateType } from '../const.js';
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

  #keyArray = [];

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
    this.#filmComponent.setFilmCardClickHandler(() => {
      this.#renderPopup(film, this.#changeFilmCardControls, this.#submitFormHandler, this.#deleteCommentFilmCard);
    });

    this.#filmComponent.setControlClickHandler(this.#changeFilmCardControls);

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

  #renderPopup = (film, updateFilmCard, submitFormHandler, deleteComment) => {
    this.#popupMode = PopupMode.POPUP_OPEN;
    this.#changeMode();
    document.body.classList.add('hide-overflow');
    document.addEventListener('keydown', this.#onEscKeyDown);
    this.#runOnKeys('Control', 'Enter');

    this.#popupContainerComponent = new PopupContainerView(film, updateFilmCard, submitFormHandler, deleteComment);
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

  #submitFormHandler = (newComment) => {
    this.changeData(
      UserAction.ADD_COMMENT,
      UpdateType.ALL_LISTS,
      {...this.#film, comments: {...newComment.id }});
    this.#closePopup();
  }

  #runOnKeys = (...keys) => {
    document.addEventListener('keydown', (evt) => {
      if (evt.repeat) {
        return;
      }
      this.#keyArray = [...this.#keyArray, evt.key];
      return this.#keyArray;
    });

    document.addEventListener('keyup', () => {
      if (this.#keyArray.length === 0) {
        return;
      }

      let runFunc = true;

      keys.forEach((key) => {
        if (!this.#keyArray.includes(key)) {
          runFunc = false;
        }
      });

      if (runFunc) {
        this.#submitFormHandler();
      }

      this.#keyArray = [];
    });

  }

  #changeFilmCardControls = (newDetailsData) => {
    this.#changeData(
      UserAction.CHANGE_CONTROLS,
      UpdateType.FILTERS_AND_LIST,
      {...this.#film, userDetails: {...newDetailsData }});
  }

  #deleteCommentFilmCard = (commentId) => {
    const index = this.#film.comments.findIndex((el) => el === commentId);

    this.changeData(
      UserAction.DELETE_COMMENT,
      UpdateType.ALL_LISTS,
      {...this.#film, comments:
        {...this.#film.comments.slice(0, index),
          ...this.#film.comments.slice(index+1),}
      });
  }
}
