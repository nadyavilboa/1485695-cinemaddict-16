import AbstractObservable from '../utils/abstract-observable.js';
import { adaptToClient } from '../utils/common.js';

export default class CommentsModel extends AbstractObservable {
  #apiService = null;
  #comments = [];

  constructor(apiService) {
    super();
    this.#apiService = apiService;
  }

  get comments() {
    return this.#comments;
  }

  init = async (filmId) => {
    try {
      const commentsFilm = await this.#apiService.getCommentsFilm(filmId);
      this.#comments = commentsFilm;
    } catch(err) {
      this.#comments = [];
    }

  }

  addComment = async (updateType, update, position) => {
    try {
      const { movie, comments } = await this.#apiService.addComment(update.filmId, update.newComment);
      const updatedFilm = adaptToClient(movie);
      this.#comments = comments;
      this._notify(updateType, updatedFilm, position);
    } catch(err) {
      throw new Error('Can\'t add comment');
    }
  };

  deleteComment = async (updateType, { commentId, film }, position) => {
    try {
      await this.#apiService.deleteComment(commentId);

      this.#comments = this.#comments.filter(({id}) => id !== commentId);
      const commentsIds = this.#comments.map(({id}) => id);

      const updateFilm = { ...film, comments: commentsIds };

      this._notify(updateType, updateFilm, position);
    } catch(err) {
      throw new Error('Can\'t delete comment');
    }
  }
}
