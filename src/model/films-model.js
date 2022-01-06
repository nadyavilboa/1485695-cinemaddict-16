import AbstractObservable from '../utils/abstract-observable.js';

export default class FilmsModel extends AbstractObservable {
  #films = [];

  set films(films) {
    this.#films = [...films];
  }

  get films() {
    return this.#films;
  }

  updateFilm = (updateType, updateFilm) => {
    const index = this.#films.findIndex((film) => film.id === updateFilm.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting film');
    }

    this.#films = [
      ...this.#films.slice(0, index),
      updateFilm,
      ...this.#films.slice(index + 1),
    ];

    this._notify(updateType, updateFilm);
  }

  updateFilmComments = (updateFilm, filmComments) => {
    updateFilm.comments = filmComments;

    this.#films = [
      updateFilm,
      ...this.#films,
    ];

  }

  addCommentFilm = (updateType, newComment, updateFilm) => {
    const index = this.#films.findIndex((film) => film.id === updateFilm.id);
    let filmComments = this.#films[index].comments;

    if (index === -1) {
      throw new Error('Can\'t update unexisting film');
    }

    filmComments = [
      newComment,
      ...filmComments,
    ];

    this.updateFilmComments(updateFilm, filmComments);

    this._notify(updateType, updateFilm);
  }

  deleteCommentFilm = (updateType, updateFilm, commentId) => {
    const index = this.#films.findIndex((film) => film.id === updateFilm.id);
    let filmComments = this.#films[index].comments;
    const indexComment = filmComments.findIndex((comment) => comment === commentId);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting comment');
    }

    filmComments = [
      ...filmComments.slice(0, indexComment),
      ...filmComments.slice(indexComment + 1),
    ];

    this.updateFilmComments(updateFilm, filmComments);

    this._notify(updateType);
  }
}
