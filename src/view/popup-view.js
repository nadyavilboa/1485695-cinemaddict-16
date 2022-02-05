import SmartView from './smart-view.js';
import { countHourInDuration, countMinutesInDuration } from '../utils/common.js';
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

const createPopupControlsTemplate = ({watchList, alreadyWatched, favorite}, isDisabled) => (
  `<section class="film-details__controls">
    <button
      ${isDisabled ? 'disabled' : ''}
      type="button"
      class="film-details__control-button film-details__control-button--watchlist ${watchList ? 'film-details__control-button--active' : ''}"
      id="watchlist"
      name="watchlist"
    >
      ${watchList ? 'Added to watchlist' : 'Add to watchlist'}
    </button>
    <button
      ${isDisabled ? 'disabled' : ''}
      type="button"
      class="film-details__control-button film-details__control-button--watched ${alreadyWatched ? 'film-details__control-button--active' : ''}"
      id="watched"
      name="watched"
    >
      ${alreadyWatched ? 'Already watched' : 'Not watched yet'}
    </button>
    <button
      ${isDisabled ? 'disabled' : ''}
      type="button"
      class="film-details__control-button film-details__control-button--favorite ${favorite ? 'film-details__control-button--active' : ''}"
      id="favorite"
      name="favorite"
    >
      ${favorite ? 'Added to favorites' : 'Add to favorites'}
    </button>
  </section>`
);

const createPopupCommentTemplate = ({id, emotion, comment, author, date}, commentId, isDisabled, isDeleting) => {
  const isDeletingComment = commentId === id;
  return `<li class="film-details__comment">
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
          ${isDeletingComment && isDisabled ? 'disabled' : ''}
          type="button"
          class="film-details__comment-delete"
          data-comment-id="${id}"
        >
            ${isDeletingComment && isDeleting ? 'Deleting...' : 'Delete'}
        </button>
      </p>
    </div>
  </li>`;
};

const createPopupEmotionListTemplate = (emotionList, activeEmotion, isDisabled) => (
  `<div class="film-details__emoji-list">
    ${emotionList.map((emotion) => (
    `<input
      class="film-details__emoji-item visually-hidden"
      name="comment-emoji"
      type="radio"
      id="emoji-${emotion}"
      value="${emotion}"
      ${emotion === activeEmotion ? 'checked' : ''}
      ${isDisabled ? 'disabled' : ''}
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

const createPopupNewCommentTemplate = ({text, emotion}, isDisabled) => {
  const popupEmotionListTemplate = createPopupEmotionListTemplate(COMMENTS_EMOTION, emotion, isDisabled);

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
          ${isDisabled ? 'disabled' : ''}
        >${he.encode(text)}</textarea>
      </label>
      ${popupEmotionListTemplate}
    </div>`);
};

const createPopupCommentsContainerTemplate = (commentsId, comments, commentId, isDisabled, isDeleting) => {
  const commentsList = comments.map((comment) => createPopupCommentTemplate(comment, commentId, isDisabled, isDeleting)).join(' ');
  return `<section class="film-details__comments-wrap">
    <h3 class="film-details__comments-title">Comments
      <span class="film-details__comments-count">${commentsId.length}</span>
    </h3>
    <ul class="film-details__comments-list">
      ${commentsList}
    </ul>
  </section>`;
};

const createPopupTemplate = (data, comments) => {

  const popupCloseButton = createPopupCloseButtonTemplate();

  const popupInfoContainer = createPopupInfoContainerTemplate(data);

  const popupControls = createPopupControlsTemplate(data.userDetails, data.isDisabled);

  const commentsContainer = createPopupCommentsContainerTemplate(data.comments, comments, data.commentId, data.isDisabled, data.isDeleting);

  const newCommentContainer = createPopupNewCommentTemplate(data.comment, data.isSaving);

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

  #deleteComment = null;

  constructor(film, updateFilmCard, comments, deleteComment) {
    super();
    this._data = PopupView.parseFilmToData(film);

    this.#updateFilmCard = updateFilmCard;
    this.#comments = comments;
    this.#deleteComment = deleteComment;

    this.#setInnerHandlers();
  }

  get template() {
    return createPopupTemplate(this._data, this.#comments);
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
    return this.element.scrollTop;
  }

  scrollPopup = (scrollPosition) => {
    this.element.scrollTo(0, scrollPosition);
  }

  getFormData = () => {
    const form = this.element.querySelector('form');
    return new FormData(form);
  }

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

    this.#updateFilmCard(newUserDetails);
  }

  #deleteHandler = (evt) => {
    this.#deleteComment(evt.target.dataset.commentId);
  }

  #textCommentInputHandler = (evt) => {
    this.updateData({
      ...this._data,
      comment: {...this._data.comment, text:evt.target.value}
    }, true);
  }

  #inputEmotionClickHandler = (evt) => {
    this.updateData({
      ...this._data,
      comment: {...this._data.comment, emotion: evt.target.value}});
  }

  setCloseClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.querySelector('.film-details__close-btn')
      .addEventListener('click', this.#closeClickHandler);
  }

  #closeClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();
  }

  static parseFilmToData = (film) => ({...film,
    comment: BLANK_COMMENT,
    commentId: null,
    isSaving: false,
    isDeleting: false,
    isDisabled: false,
  });
}
