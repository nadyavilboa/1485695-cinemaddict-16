import AbstractObservable from '../utils/abstract-observable.js';
import { generateComment } from '../mock/comments.js';

export default class CommentsModel extends AbstractObservable {
  #comments = [];

  #newComment = {};

  set comments(commetns) {
    this.#comments = [...commetns];
  }

  get comments() {
    return this.#comments;
  }

  generateNewComment = (data) => {
    const newComment = generateComment();

    newComment.comment = data.text;
    newComment.emotion = data.emotion;

    return newComment;
  }

  addComment = (updateType, data) => {
    const newComment = this.generateNewComment(data);
    this.#comments = [
      newComment,
      ...this.#comments,
    ];

    this._notify(updateType, newComment);
  };

  deleteComment = (updateType, commentId) => {
    const index = this.#comments.findIndex((comment) => comment.id === commentId);

    if (index === -1) {
      throw new Error('Can\'t delete unexisiting comment');
    }

    this.#comments = [
      ...this.#comments.slice(0, index),
      ...this.#comments.slice(index + 1),
    ];

    this._notify(updateType);
  };
}
