import SmartView from './smart-view.js';
import { countHourInDuration, countMinutesInDuration } from '../utils/common.js';
import { createElement } from '../utils/render.js';
import { ControlType } from '../const.js';
import { COMMENTS_EMOTION, BLANK_COMMENT } from '../const.js';
import he from 'he';
import dayjs from 'dayjs';

const createPopupCloseButtonTemplate = () => (
  `<div class="film-details__close">
    <button class="film-details__close-btn" type="button">
      close
    </button>
  </div>`
);

const createPopupInfoContainerTemplate = (film) => (
  `<div class="film-details__info-wrap">
    <div class="film-details__poster">
      <img
        class="film-details__poster-img"
        src="${film.poster}"
        alt=""
      />
      <p class="film-details__age">${film.ageRating}+</p>
    </div>
    <div class="film-details__info">
      <div class="film-details__info-head">
        <div class="film-details__title-wrap">
          <h3 class="film-details__title">${film.title}</h3>
          <p class="film-details__title-original">
            Original: ${film.alternativeTitle}
          </p>
        </div>
        <div class="film-details__rating">
          <p class="film-details__total-rating">${film.totalRating}</p>
        </div>
      </div>
      <table class="film-details__table">
        <tr class="film-details__row">
          <td class="film-details__term">Director</td>
          <td class="film-details__cell">${film.director}</td>
        </tr>
        <tr class="film-details__row">
          <td class="film-details__term">Writers</td>
          <td class="film-details__cell">${film.writers.join(', ')}</td>
        </tr>
        <tr class="film-details__row">
          <td class="film-details__term">Actors</td>
          <td class="film-details__cell">${film.actors.join(', ')}</td>
        </tr>
        <tr class="film-details__row">
          <td class="film-details__term">Release Date</td>
          <td class="film-details__cell">
            ${dayjs(film.release.date).format('DD MMMM YYYY')}
          </td>
        </tr>
        <tr class="film-details__row">
          <td class="film-details__term">Runtime</td>
          <td class="film-details__cell">
            ${countHourInDuration(film.runtime) ? countHourInDuration(film.runtime) : ''}
            ${countMinutesInDuration(film.runtime) ? countMinutesInDuration(film.runtime) : ''}
          </td>
        </tr>
        <tr class="film-details__row">
          <td class="film-details__term">Country</td>
          <td class="film-details__cell">${film.release.releaseCountry}</td>
        </tr>
        <tr class="film-details__row">
          <td class="film-details__term">Genres</td>
          <td class="film-details__cell">
            ${film.genres.map((genre) => `<span class="film-details__genre">${genre}</span>`).join(' ')}
          </td>
        </tr>
      </table>
      <p class="film-details__film-description">
        ${film.description}
      </p>
    </div>
  </div>`
);

const createPopupControlsTemplate = ({watchList, alreadyWatched, favorite}) => (
  `<section class="film-details__controls">
    <button
      type="button"
      class="film-details__control-button film-details__control-button--watchlist ${watchList ? 'film-details__control-button--active' : ''}"
      id="watchlist"
      name="watchlist"
    >
      ${watchList ? 'Added to watchlist' : 'Add to watchlist'}
    </button>
    <button
      type="button"
      class="film-details__control-button film-details__control-button--watched ${alreadyWatched ? 'film-details__control-button--active' : ''}"
      id="watched"
      name="watched"
    >
      ${alreadyWatched ? 'Already watched' : 'Not watched yet'}
    </button>
    <button
      type="button"
      class="film-details__control-button film-details__control-button--favorite ${favorite ? 'film-details__control-button--active' : ''}"
      id="favorite"
      name="favorite"
    >
      ${favorite ? 'Added to favorites' : 'Add to favorites'}
    </button>
  </section>`
);

const createPopupCommentTemplate = ({id, emotion, comment, author, date}, isDisabled, isDeleting) => (
  `<li class="film-details__comment">
    <span class="film-details__comment-emoji">
      <img
        src="./images/emoji/${emotion}.png"
        width="55"
        height="55"
        alt="emoji-smile"
      />
    </span>
    <div>
      <p class="film-details__comment-text">${comment}</p>
      <p class="film-details__comment-info">
        <span class="film-details__comment-author">${author}</span>
        <span class="film-details__comment-day">
          ${dayjs(date).format('DD/MM/YYYY hh:mm')}
        </span>
        <button
          class="film-details__comment-delete"
          data-comment-id="${id}"
          ${isDisabled ? 'disabled' : ''}>
          ${isDeleting ? 'Deleting...' : 'Delete'}
        </button>
      </p>
    </div>
  </li>`
);

const createPopupEmotionListTemplate = (emotionList, activeEmotion, isSaving) => (
  `<div class="film-details__emoji-list">
    ${emotionList.map((emotion) => (
    `<input
      class="film-details__emoji-item visually-hidden"
      name="comment-emoji"
      type="radio"
      id="emoji-${emotion}"
      value="${emotion}"
      ${emotion === activeEmotion ? 'checked' : ''}
      ${isSaving ? 'disabled' : ''}
    >
    <label
      class="film-details__emoji-label"
      for="emoji-${emotion}"
    >
      <img
        src="./images/emoji/${emotion}.png"
        width="30"
        height="30"
        alt="emoji"
      />
    </label>`)).join('')}
  </div>`
);

const createPopupNewCommentTemplate = ({text, emotion}, isSaving) => {
  const popupEmotionListTemplate = createPopupEmotionListTemplate(COMMENTS_EMOTION, emotion, isSaving);

  return (
    `<div class="film-details__new-comment">
      <div class="film-details__add-emoji-label">
        <img
          src="images/emoji/${emotion}.png"
          width="55"
          height="55"
          alt="emoji-${emotion}"
        />
      </div>
      <label class="film-details__comment-label">
        <textarea
          name="comment-text"
          class="film-details__comment-input"
          placeholder="Select reaction below and write comment here" name="comment"
          ${isSaving ? 'disabled' : ''}
        >${he.encode(text)}</textarea>
      </label>
      ${popupEmotionListTemplate}
    </div>`);
};

const createPopupCommentsContainerTemplate = (commentsId, comments, isDisabled, isDeleting) => {
  const commentsList = comments.map((comment) => createPopupCommentTemplate(comment, isDisabled, isDeleting)).join(' ');
  return `<section class="film-details__comments-wrap">
    <h3 class="film-details__comments-title">Comments
      <span class="film-details__comments-count">${commentsId.length}</span>
    </h3>
    <ul class="film-details__comments-list">
      ${commentsList}
    </ul>
  </section>`;
};

const createPopupTemplate = (data, comments, newComment) => {

  const popupCloseButton = createPopupCloseButtonTemplate();

  const popupInfoContainer = createPopupInfoContainerTemplate(data);

  const popupControls = createPopupControlsTemplate(data.userDetails);

  const commentsContainer = createPopupCommentsContainerTemplate(data.comments, comments, data.isDisabled, data.isDeleting);

  const newCommentContainer = createPopupNewCommentTemplate(newComment, data.isSaving);

  return `<section class="film-details">
    <form class="film-details__inner" action="" method="get">
      <div class="film-details__top-container">
        ${popupCloseButton}
        ${popupInfoContainer}
        ${popupControls}
      </div>
      <div class="film-details__bottom-container">
        ${commentsContainer}
        ${newCommentContainer}
      </div>
    </form>
  </section>`;
};

export default class PopupView extends SmartView {
  #element = null;

  #updateFilmCard = null;
  #comments = null;

  #newComment = null;

  #formElement= null;
  #deleteComment = null;

  constructor(film, updateFilmCard, comments, deleteComment, newComment = BLANK_COMMENT) {
    super();
    this._data = PopupView.parseFilmToData(film);

    this.#updateFilmCard = updateFilmCard;
    this.#comments = comments;

    this.#deleteComment = deleteComment;

    this.#newComment = newComment;

    this.#setInnerHandlers();
  }

  get element() {

    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    this.#formElement = this.#element.querySelector('.film-details__inner');

    return this.#element;
  }

  get template() {
    return createPopupTemplate(this._data, this.#comments, this.#newComment);
  }

  restoreHandlers = () => {
    this.#setInnerHandlers();
  }

  #setInnerHandlers = () => {
    const popupControls = this.element.querySelector('.film-details__controls');
    popupControls.addEventListener('click', this.#controlClickHandler);

    const commentItems = this.element.querySelectorAll('.film-details__comment');
    commentItems.forEach((comment) => (
      comment.addEventListener('click', this.#deleteHandler))
    );

    this.element.querySelector('.film-details__comment-input')
      .addEventListener('input', this.#textCommentInputHandler);

    const inputsEmotion = this.element.querySelectorAll('.film-details__emoji-item');
    inputsEmotion.forEach((inputEmotion) => (
      inputEmotion.addEventListener('click', this.#inputEmotionClickHandler))
    );
  }

  get scrollTopOffset() {
    return this.#element.scrollTop;
  }

  scrollPopup = (scrollPosition) => {
    this.#element.scrollTo(0, scrollPosition);
  }

  getFormData = () => new FormData(this.#formElement);

  #controlClickHandler = (evt) => {
    evt.preventDefault();

    if (!evt.target.closest('.film-details__control-button')) {
      return;
    }

    let newUserDetails = null;

    switch (evt.target.id) {
      case ControlType.WATCHLIST:
        newUserDetails = {...this._data.userDetails, watchList: !this._data.userDetails.watchList};
        break;
      case ControlType.ALREADY_WATCHED:
        newUserDetails = {...this._data.userDetails, alreadyWatched: !this._data.userDetails.alreadyWatched, watchingDate: !this._data.userDetails.watchingDate ? dayjs().toDate() : null};
        break;
      case ControlType.FAVORITE:
        newUserDetails = {...this._data.userDetails, favorite: !this._data.userDetails.favorite};
        break;
      default:
        throw new Error(`Unknown control type ${evt.target.id}`);
    }

    this.updateData(newUserDetails);
    this.#updateFilmCard(newUserDetails);
  }

  #deleteHandler = (evt) => {
    evt.preventDefault();
    this.#deleteComment(evt.target.dataset.commentId);
  }

  #textCommentInputHandler = (evt) => {
    evt.preventDefault();
    this._data = {...this._data, text: evt.target.value};
    this.updateData(this._data, true);
  }

  #inputEmotionClickHandler = (evt) => {
    evt.preventDefault();
    const newCommentData = {...this._data.newComment, emotion: evt.target.value};
    this._data = {...this._data, newComment: newCommentData};
    this.#newComment = this._data;

  }

  setCloseClickHandler = (callback) => {
    this._callback.click = callback;
    this.#element.querySelector('.film-details__close-btn')
      .addEventListener('click', this.#closeClickHandler);
  }

  #closeClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();
  }

  static parseFilmToData = (film) => ({...film,
    newComment: BLANK_COMMENT,
    isSaving: false,
    isDeleting: false,
    isDisabled: false,
  });

  static parseDataToFilm = (data) => {
    const film = {...data};

    delete film.isDisabled;
    delete film.isSaving;
    delete film.isDeleting;
  }
}
