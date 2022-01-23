import PopupContainerView from '../view/popup-container-view.js';
import FilmView from '../view/film-view.js';
import { renderElement, removeComponent, replace } from '../utils/render.js';
import { UserAction, UpdateType } from '../const.js';
import { isEscapeEvent, isEnterEvent, isControlEvent, getObjectKeyValue } from '../utils/common.js';

const PopupMode = {
  POPUP_CLOSE: 'CLOSE',
  POPUP_OPEN: 'OPEN',
};

export default class FilmPresenter {
  #filmsListContainer = null;
  #filmComponent = null;
  #film = null;
  #comments = null;
  #commentsModel = null;

  #popupMode = PopupMode.POPUP_CLOSE;

  #changeData = null;
  #changeMode = null;

  #popupContainerComponent = null;

  #keyArray = []; //нужен для закоментированной функции

  constructor (filmsListContainer, changeData, changeMode, commentsModel) {
    this.#filmsListContainer = filmsListContainer;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
    this.#commentsModel = commentsModel;
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

    this.#filmsListContainer = null;
    this.#film = null;
    this.#comments = null;

    this.#popupMode = PopupMode.POPUP_CLOSE;

    this.#changeData = null;
    this.#changeMode = null;

    this.#popupContainerComponent = null;
  }

  #renderPopup = (film, changePopupControls, formSubmit, deleteComment) => {
    this.#popupMode = PopupMode.POPUP_OPEN;
    this.#changeMode();
    this.#comments = this.#getFilmComments(film.comments);

    document.body.classList.add('hide-overflow');
    document.addEventListener('keydown', this.#onEscKeyDown);

    this.#runOnKeys();

    this.#popupContainerComponent = new PopupContainerView(film, changePopupControls, this.#comments, formSubmit, deleteComment);
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
  }

  #getFilmComments = (commentsIds) => {
    const filmComments = [];

    commentsIds.forEach((commentId) => {
      let filmComment = null;
      filmComment = getObjectKeyValue(this.#commentsModel.comments, 'id', commentId);

      if(filmComment) {
        filmComments.push(filmComment);
      }
    });

    return filmComments;
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
      UpdateType.MAJOR,
      {...this.#film, userDetails: {...newDetailsData }});
  }

  #deleteCommentFilmCard = (commentId) => {
    const index = this.#film.comments.findIndex((el) => el === commentId);

    this.#changeData(
      UserAction.DELETE_COMMENT,
      UpdateType.MINOR_ALL_LISTS,
      {...this.#film, comments:
        {...this.#film.comments.slice(0, index),
          ...this.#film.comments.slice(index+1),}
      });
  }
}
