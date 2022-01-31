import PopupContainerView from '../view/popup-container-view.js';
import FilmView from '../view/film-view.js';
import { renderElement, removeComponent, replace } from '../utils/render.js';
import { UserAction, UpdateType } from '../const.js';
import { isCtrlEnterEvent, isEscapeEvent } from '../utils/common.js';

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

  init = (film, position) => {
    const scrollPosition = position || 0;

    this.#film = film;

    const prevFilmComponent = this.#filmComponent;
    const prevPopupComponent = this.#popupContainerComponent;

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
      this.#popupContainerComponent = new PopupContainerView(
        film,
        this.#changeFilmCardControls,
        this.#commentsModel.comments,
        this.#deleteCommentFilmCard,
      );
      replace(this.#popupContainerComponent, prevPopupComponent);
      this.#popupContainerComponent.scrollPopup(scrollPosition);
      this.#popupContainerComponent.setCloseClickHandler(this.#closePopup);
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

    this.#popupContainerComponent = null;
  }

  #renderPopup = (film, changePopupControls, deleteComment, scrollPosition) => {
    this.#popupMode = PopupMode.POPUP_OPEN;
    this.#changeMode();
    this.#commentsModel.init(this.#film.id).finally(() => {
      this.#comments = this.#commentsModel.comments;

      document.body.classList.add('hide-overflow');
      document.addEventListener('keydown', this.#onEscKeyDown);
      document.addEventListener('keydown', this.#onCtrlEnterDown);

      this.#popupContainerComponent = new PopupContainerView(film, changePopupControls, this.#comments, deleteComment);
      renderElement(document.body, this.#popupContainerComponent);

      this.#popupContainerComponent.scrollPopup(scrollPosition);
      this.#popupContainerComponent.setCloseClickHandler(this.#closePopup);
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

      if (this.#popupContainerComponent) {
        const formData = this.#popupContainerComponent.getFormData();
        const position = this.#popupContainerComponent.scrollTopOffset;

        const newComment = {
          comment: formData.get('comment-text'),
          emotion: formData.get('comment-emoji'),
        };

        const filmId = this.#film.id;
        this.#changeData(
          UserAction.ADD_COMMENT,
          UpdateType.PATH,
          { filmId, newComment },
          position,
        );
      }
    }
  }

  #changeFilmCardControls = (newDetailsData) => {
    const position = this.#popupContainerComponent ? this.#popupContainerComponent.scrollTopOffset : 0;

    this.#changeData(
      UserAction.CHANGE_CONTROLS,
      UpdateType.PATH,
      {...this.#film, userDetails: {...newDetailsData }},
      position,
    );
  }

  #deleteCommentFilmCard = (commentId) => {
    const position = this.#popupContainerComponent ? this.#popupContainerComponent.scrollTopOffset : 0;
    this.#changeData(
      UserAction.DELETE_COMMENT,
      UpdateType.PATH,
      { commentId, film: this.#film },
      position,
    );
  }
}
