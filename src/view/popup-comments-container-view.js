import { createElement, renderElement } from '../utils/render.js';
import PopupCommentView from './popup-comment-view';
import PopupNewCommentView from './popup-new-comment-view.js';

import AbstractView from './abstract-view.js';

const createPopupCommentsContainerTemplate = (commentsId) => (
  `<section class="film-details__comments-wrap">
    <h3 class="film-details__comments-title">Comments
      <span class="film-details__comments-count">${commentsId.length}</span>
    </h3>
    <ul class="film-details__comments-list"></ul>
  </section>`
);

export default class PopupCommentsContainerView extends AbstractView {
  #element = null;
  #comments = null;

  #deleteComment = null;

  constructor(comments, deleteComment) {
    super();
    this.#comments = comments;

    this.#deleteComment = deleteComment;

  }

  #renderCommentList = () => {
    this.commentsList = this.#element.querySelector('.film-details__comments-list');
    this.#comments.forEach((comment) => renderElement(this.commentsList,
      new PopupCommentView(comment, this.#deleteComment)));
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    this.#renderCommentList();

    renderElement(this.#element, new PopupNewCommentView());

    return this.#element;
  }

  get template() {
    return createPopupCommentsContainerTemplate(this.#comments);
  }

}
