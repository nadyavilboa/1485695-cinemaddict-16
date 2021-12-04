import PopupContainerView from './view/popup-container-view';
import PopupInfoContainerView from './view/popup-info-container-view.js';
import PopupControlsView from './view/popup-controls-view.js';
import PopupCommentsContainerView from './view/popup-commets-container-view.js';
import PopupCommentsListView from './view/popup-comments-list-view.js';
import PopupCommentView from './view/popup-comment-view.js';
import PopupNewCommentView from './view/popup-new-comment-view.js';
import PopupEmojiListView from './view/popup-emoji-list-view.js';
import { isEscapeEvent } from './utils.js';
import { films } from './main.js';
import { comments } from './mock/comments.js';
import { CommentsStringData } from './mock/comments.js';
import { renderElement } from './render.js';

const body = document.querySelector('body');
const popupElement = body.querySelector('.film-details');
const popupFormElement = popupElement.querySelector('.film-details__inner');

const renderPopupFilm = (film) => {
  const popupContainerComponent = new PopupContainerView();
  renderElement(popupFormElement, popupContainerComponent.element);
  const popupInfoContainerElement = popupFormElement.querySelector('.film-details__top-container');

  const popupInfoContainerComponent = new PopupInfoContainerView(film);
  renderElement(popupInfoContainerElement, popupInfoContainerComponent.element);

  renderElement(popupFormElement, new PopupControlsView(film.userDetails).element);

  renderElement(popupFormElement, new PopupCommentsContainerView(film.comments.length).element);

  const commentsContainerElement = popupFormElement.querySelector('.film-details__comments-wrap');

  const popupCommentsListComponent = new PopupCommentsListView();
  renderElement(commentsContainerElement, popupCommentsListComponent.element);

  for (let i = 0; i < film.comments.length; i++) {
    renderElement(popupCommentsListComponent.element, new PopupCommentView(comments[i]).element);
  }

  const newCommentContainerElement = new PopupNewCommentView();
  renderElement(commentsContainerElement, newCommentContainerElement.element);
  renderElement(newCommentContainerElement.element, new PopupEmojiListView(CommentsStringData.COMMENTS_EMOTION, false).element);
};

const closePopup = () => {
  if(body.classList.contains('hide-overflow')) {
    body.classList.remove('hide-overflow');
  }
  popupFormElement.innerHTML = '';
  const buttonCloseElement = popupFormElement.querySelector('.film-details__close-btn');
  buttonCloseElement.removeEventListener();
};

function documentKeydownHandler(evt) {
  if (isEscapeEvent(evt)) {
    evt.preventDefault();
    closePopup();
  }
}

const buttonCloseElementHandler = (evt) => {
  evt.preventDefault();
  closePopup();
  document.removeEventListener('keydown', documentKeydownHandler);
};

const openPopup = (filmId) => {
  if(!body.classList.contains('hide-overflow')) {
    body.classList.add('hide-overflow');
  }

  renderPopupFilm(films[filmId]);

  const buttonCloseElement = popupFormElement.querySelector('.film-details__close-btn');
  buttonCloseElement.addEventListener('click', buttonCloseElementHandler);
  document.addEventListener('keydown', documentKeydownHandler);
};

export const filmClickHandler = (evt) => {
  const cardId = evt.target.closest('a').id;
  openPopup(cardId);
};
