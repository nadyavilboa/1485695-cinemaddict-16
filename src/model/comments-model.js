import AbstractObservable from '../utils/abstract-observable.js';
import { generateComment } from '../mock/comments.js';

export default class CommentsModel extends AbstractObservable {
  #comments = [];

  set comments(comments) {
    this.#comments = [...comments];
  }

  get comments() {
    return this.#comments;
  }

  //при вводе коммента получаем текст и эмоцию, нужно сгенерировать полный объект комментария
  //иначе откуда возмутся данные об авторе, дате коммента и т.д.

  addComment = (updateType, data) => {
    const newComment = generateComment(); //объект со всеми полями
    newComment.comment = data.text; //заполняем данными от пользователя
    newComment.emotion = data.emotion;

    this.#comments = [newComment, ...this.#comments];

    this._notify(updateType, newComment);
  };

  deleteComment = (updateType, commentId) => {
    this.#comments = this.#comments.filter(({id}) => id !== commentId);

    this._notify(updateType);
  };
}
