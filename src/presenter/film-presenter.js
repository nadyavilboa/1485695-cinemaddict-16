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
  #comments = null;
  #commentsModel = null;

  #popupMode = PopupMode.POPUP_CLOSE;

  #changeData = null;
  #changeMode = null;

  #popupContainerComponent = null;

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
      this.#renderPopup(film, this.#changeFilmCardControls, this.#submitForm, this.#deleteCommentFilmCard);
    });

    this.#filmComponent.setControlClickHandler(this.#changeFilmCardControls);

    if (prevFilmComponent === null) {
      renderElement(this.#filmsListContainer, this.#filmComponent);
    } else {
      replace(this.#filmComponent, prevFilmComponent);
    }

    removeComponent(prevFilmComponent);

    if (this.#popupContainerComponent) {
      removeComponent(this.#popupContainerComponent);
      this.#renderPopup(film, this.#changeFilmCardControls, this.#submitForm, this.#deleteCommentFilmCard);
    }
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
    this.#commentsModel.init(this.#film.id).finally(() => {
      this.#comments = this.#commentsModel.comments;

      document.body.classList.add('hide-overflow');
      document.addEventListener('keydown', this.#onEscKeyDown);

      this.#popupContainerComponent = new PopupContainerView(film, changePopupControls, this.#comments, deleteComment);
      renderElement(document.body, this.#popupContainerComponent);

      this.#popupContainerComponent.setCloseClickHandler(this.#closePopup);
      this.#popupContainerComponent.setFormSubmitHandler(this.#submitForm);
    });

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

  #submitForm = (newComment) => {
    const filmId = this.#film.id;
    this.#changeData(
      UserAction.ADD_COMMENT,
      UpdateType.PATH,
      { filmId, newComment }
    );
  }

  #changeFilmCardControls = (newDetailsData) => {
    this.#changeData(
      UserAction.CHANGE_CONTROLS,
      UpdateType.MAJOR,
      {...this.#film, userDetails: {...newDetailsData }});
  }

  #deleteCommentFilmCard = (commentId) => {
    this.#changeData(
      UserAction.DELETE_COMMENT,
      UpdateType.PATH,
      { commentId, film: this.#film },
    );
  }
}
