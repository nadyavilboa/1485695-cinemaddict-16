import AbstractView from './abstract-view.js';
import dayjs from 'dayjs';
import { countHourInDuration, countMinutesInDuration } from '../utils/common.js';
import { getObjectKeyValue } from '../utils/common.js';
import { comments } from '../mock/comments.js';
import { CommentsStringData } from '../mock/comments.js';

const newComment = {
  emoji: 'smile',
};

const createPopupInfoContainerTemplate = (film) => (
  `<div class="film-details__info-wrap">
    <div class="film-details__poster">
      <img class="film-details__poster-img" src="${film.poster}" alt="">

      <p class="film-details__age">${film.ageRating}+</p>
    </div>

    <div class="film-details__info">
      <div class="film-details__info-head">
        <div class="film-details__title-wrap">
          <h3 class="film-details__title">${film.title}</h3>
          <p class="film-details__title-original">Original: ${film.alternativeTitle}</p>
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
          <td class="film-details__cell">${dayjs(film.release.date).format('DD MMMM YYYY')}</td>
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

const createPopupControlsTemplate = (userDetails) => (
  `<section class="film-details__controls">
    <button type="button" class="film-details__control-button film-details__control-button--watchlist ${userDetails.watchList ? 'film-details__control-button--active' : ''}" id="watchlist" name="watchlist">
      ${userDetails.watchList ? 'Added to watchlist' : 'Add to watchlist'}
    </button>
    <button type="button" class="film-details__control-button film-details__control-button--watched ${userDetails.alreadyWatched ? 'film-details__control-button--active' : ''}" id="watched" name="watched">
      ${userDetails.alreadyWatched ? 'Already watched' : 'Not watched yet'}
    </button>
    <button type="button" class="film-details__control-button film-details__control-button--favorite ${userDetails.favorite ? 'film-details__control-button--active' : ''}" id="favorite" name="favorite">
      ${userDetails.favorite ? 'Added to favorites' : 'Add to favorites'}
    </button>
  </section>`
);

const createPopupCommentTemplate = (comment) => (
  `<li class="film-details__comment">
    <span class="film-details__comment-emoji">
      <img src="./images/emoji/${comment.emotion}.png" width="55" height="55" alt="emoji-smile">
    </span>
    <div>
      <p class="film-details__comment-text">${comment.comment}</p>
      <p class="film-details__comment-info">
        <span class="film-details__comment-author">${comment.author}</span>
        <span class="film-details__comment-day">${dayjs(comment.date).format('DD/MM/YYYY hh:mm')}</span>
        <button class="film-details__comment-delete">Delete</button>
      </p>
    </div>
  </li>`
);

const createPopupEmojiListTemplate = (emojiList, isChecked) => (
  `<div class="film-details__emoji-list">
    ${emojiList.map((emoji) =>
    `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emoji}" value="${emoji}" ${isChecked ? 'checked' : ''}>
    <label class="film-details__emoji-label" for="emoji-${emoji}">
      <img src="./images/emoji/${emoji}.png" width="30" height="30" alt="emoji">
    </label>`).join(' ')}
  </div>`
);

const createPopupNewCommentTemplate = (emojiList, isChecked) => {

  const popupEmojiListTemplate = createPopupEmojiListTemplate(emojiList, isChecked);

  return `<div class="film-details__new-comment">
    <div class="film-details__add-emoji-label">
      <img src="images/emoji/${newComment.emoji}.png" width="55" height="55" alt="emoji-${newComment.emoji}">
    </div>

    <label class="film-details__comment-label">
      <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">Great movie!</textarea>
    </label>
    ${popupEmojiListTemplate}
  </div>`;
};

const getCommentTemplate = (commentId) => {
  const comment = getObjectKeyValue(comments, 'id', commentId);
  const popupCommentTemplate = createPopupCommentTemplate(comment);
  return popupCommentTemplate;
};

const createPopupCommentsContainerTemplate = (commentsId) => {
  const popupNewCommentTemplate = createPopupNewCommentTemplate(CommentsStringData.COMMENTS_EMOTION, false);

  return `<section class="film-details__comments-wrap">
    <h3 class="film-details__comments-title">Comments
      <span class="film-details__comments-count">${commentsId.length}</span>
    </h3>

    <ul class="film-details__comments-list">
      ${commentsId.map((commentId) => getCommentTemplate(commentId)).join(' ')}
    </ul>
    ${popupNewCommentTemplate}
  </section>`;
};

const createPopupTemplate = (film) => {
  const PopupInfoContainerTemplate = createPopupInfoContainerTemplate(film);

  const PopupControlsTemplate = createPopupControlsTemplate(film.userDetails);

  const PopupCommentsContainerTemplate = createPopupCommentsContainerTemplate(film.comments);

  return `<section class="film-details">
    <form class="film-details__inner" action="" method="get">
      <div class="film-details__top-container">
        <div class="film-details__close">
        </div>
        ${PopupInfoContainerTemplate}
        ${PopupControlsTemplate}
      </div>

      <div class="film-details__bottom-container">
        ${PopupCommentsContainerTemplate}
      </div>
    </form>
  </section>`;
};

export default class PopupView extends AbstractView {
  #film = null;
  scrollPosition = 0;

  constructor(film) {
    super();
    this.#film = film;

    this.#setPopupHandlers();
  }

  get template() {
    return createPopupTemplate(this.#film);
  }

  resetNewComment = () => {
    const newCommentComponent = document.body.querySelector('.film-details__new-comment');
    newCommentComponent.innerHTML = createPopupNewCommentTemplate(CommentsStringData.COMMENTS_EMOTION, false);
    this.#setPopupHandlers();
  }

  restoreHandlers = () => {
    this.#setPopupHandlers();
  }

  #setPopupHandlers = () => {
    const inputsEmoji = this.element.querySelectorAll('.film-details__emoji-item');
    inputsEmoji.forEach((inputEmoji) =>
      inputEmoji.addEventListener('click', this.#inputEmojiHandler));
  }

  #inputEmojiHandler = (evt) => {
    evt.preventDefault();
    newComment.emoji = evt.target.value;
    this.resetNewComment(newComment);
  }

  setWatchListClickHandler = (callback) => {
    this._callback.watchListClick = callback;
    this.element.querySelector('.film-details__control-button--watchlist')
      .addEventListener('click', this.#watchListClickHandler);
  }

  setWatchedClickHandler = (callback) => {
    this._callback.watchedClick = callback;
    this.element.querySelector('.film-details__control-button--watched')
      .addEventListener('click', this.#watchedClickHandler);
  }

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element.querySelector('.film-details__control-button--favorite')
      .addEventListener('click', this.#favoriteClickHandler);
  }

  #watchListClickHandler = (evt) => {
    evt.preventDefault();
    this.scrollPosition = this.element.scrollHeight;
    this._callback.watchListClick();
  }

  #watchedClickHandler = (evt) => {
    evt.preventDefault();
    this.scrollPosition = this.element.scrollHeight;
    this._callback.watchedClick();
  }

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this.scrollPosition = this.element.scrollHeight;
    this._callback.favoriteClick();
  }

}
