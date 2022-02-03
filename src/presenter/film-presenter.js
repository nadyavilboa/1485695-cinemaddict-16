import FilmView from '../view/film-view.js';
import PopupView from '../view/popup-view.js';
import { renderElement, removeComponent, replace } from '../utils/render.js';
import { UserAction, UpdateType } from '../const.js';
import { isCtrlEnterEvent, isEscapeEvent } from '../utils/common.js';

const PopupMode = {
  POPUP_CLOSE: 'CLOSE',
  POPUP_OPEN: 'OPEN',
};

export const State = {
  SAVING: 'SAVING',
  DELETING: 'DELETING',
  ABORTING: 'ABORTING',
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

  #popupComponent = null;

  constructor (filmsListContainer, changeData, changeMode, commentsModel) {
    this.#filmsListContainer = filmsListContainer;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
    this.#commentsModel = commentsModel;
  }

  init = (film, position) => {
    const scrollPosition = position || 0;

    this.#film = film;

    const prevFilmComponent = this.#filmComponent;
    const prevPopupComponent = this.#popupComponent;

    this.#filmComponent = new FilmView(film);
    this.#filmComponent.setFilmCardClickHandler(() => {
      this.#renderPopup(film, this.#changeFilmCardControls, this.#deleteCommentFilmCard, scrollPosition);
    });

    this.#filmComponent.setControlClickHandler(this.#changeFilmCardControls);

    if (prevFilmComponent === null) {
      renderElement(this.#filmsListContainer, this.#filmComponent);
    } else {
      replace(this.#filmComponent, prevFilmComponent);
    }

    if (prevPopupComponent !== null && document.body.contains(prevPopupComponent.element)) {
      this.#popupComponent = new PopupView(
        film,
        this.#changeFilmCardControls,
        this.#commentsModel.comments,
        this.#deleteCommentFilmCard,
      );
      replace(this.#popupComponent, prevPopupComponent);
      this.#popupComponent.scrollPopup(scrollPosition);
      this.#popupComponent.setCloseClickHandler(this.#closePopup);
    }

    removeComponent(prevFilmComponent);
    removeComponent(prevPopupComponent);
  }

  destroy = () => {
    removeComponent(this.#filmComponent);

    this.#filmsListContainer = null;
    this.#film = null;
    this.#comments = null;

    this.#popupMode = PopupMode.POPUP_CLOSE;

    this.#changeData = null;
    this.#changeMode = null;

    this.#popupComponent = null;
  }

  #renderPopup = (film, changePopupControls, deleteComment, scrollPosition) => {
    this.#popupMode = PopupMode.POPUP_OPEN;
    this.#changeMode();
    this.#commentsModel.init(this.#film.id).finally(() => {
      this.#comments = this.#commentsModel.comments;

      document.body.classList.add('hide-overflow');
      document.addEventListener('keydown', this.#onEscKeyDown);
      document.addEventListener('keydown', this.#onCtrlEnterDown);

      this.#popupComponent = new PopupView(film, changePopupControls, this.#comments, deleteComment);
      renderElement(document.body, this.#popupComponent);

      this.#popupComponent.scrollPopup(scrollPosition);
      this.#popupComponent.setCloseClickHandler(this.#closePopup);
    });

  }

  resetView = () => {
    if (this.#popupMode !== PopupMode.POPUP_CLOSE) {
      this.#closePopup();
    }
  }

  setViewState = (state) => {
    if (this.#popupMode === PopupMode.POPUP_CLOSE) {
      return;
    }

    const resetFormState = () => {
      this.#popupComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    switch (state) {
      case State.SAVING:
        this.#popupComponent.updateData({
          isSaving: true,
        });
        break;
      case State.DELETING:
        this.#popupComponent.updateData({
          isDisabled: true,
          isDeleting: true,
        });
        break;
      case State.ABORTING:
        this.#popupComponent.shake(resetFormState);
        break;
    }
  }

  #closePopup = () => {
    removeComponent(this.#popupComponent);
    this.#popupComponent = null;

    document.body.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this.#onEscKeyDown);
    document.removeEventListener('keydown', this.#onCtrlEnterDown);
  }

  #onEscKeyDown = ({key}) => {
    if (isEscapeEvent(key)) {
      this.#closePopup();
    }
  }

  #onCtrlEnterDown = (evt) => {
    if (isCtrlEnterEvent(evt)) {
      evt.preventDefault();

      if (this.#popupComponent) {
        const formData = this.#popupComponent.getFormData();
        const position = this.#popupComponent.scrollTopOffset;

        const newComment = {
          comment: formData.get('comment-text'),
          emotion: formData.get('comment-emoji'),
        };

        const filmId = this.#film.id;
        this.#changeData(
          UserAction.ADD_COMMENT,
          UpdateType.PATCH,
          { filmId, newComment },
          position,
        );
      }
    }
  }

  #changeFilmCardControls = (newDetailsData) => {
    const position = this.#popupComponent ? this.#popupComponent.scrollTopOffset : 0;

    this.#changeData(
      UserAction.CHANGE_CONTROLS,
      UpdateType.PATCH,
      {...this.#film, userDetails: {...newDetailsData }},
      position,
    );
  }

  #deleteCommentFilmCard = (commentId) => {
    const position = this.#popupComponent.scrollTopOffset;

    this.#changeData(
      UserAction.DELETE_COMMENT,
      UpdateType.PATCH,
      { commentId, film: this.#film },
      position,
    );
  }
}
