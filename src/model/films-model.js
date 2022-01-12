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
}
