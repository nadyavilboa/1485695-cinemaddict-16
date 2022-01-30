import { Method } from './const.js';

export default class ApiService {
  #endPoint = null;
  #authorization = null;

  constructor(endPoint, authorization) {
    this.#endPoint = endPoint;
    this.#authorization = authorization;
  }

  get films() {
    return this.#load({url: 'movies'})
      .then(ApiService.parseResponse);
  }

  getCommentsFilm = (filmId) => this.#load({url: `comments/${filmId}`}).then(ApiService.parseResponse);

  updateFilm = async (film) => {
    const response = await this.#load({
      url: `movies/${film.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(film)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  addComment = async (filmId, newComment) => {
    const response = await this.#load({
      url: `comments/${filmId}`,
      method: Method.POST,
      body: JSON.stringify(newComment),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    return response.json();
  }

  deleteComment = async (commentId) => {
    const response = await this.#load({
      url: `comments/${commentId}`,
      method: Method.DELETE,
    });

    return response;
  }

  #adaptToServer = (film) => {
    const adaptedFilm = {
      'id': film.id,
      'comments': film.comments,
      'user_details': {
        'already_watched': film.userDetails.alreadyWatched,
        'watchlist': film.userDetails.watchList,
        'watching_date': film.userDetails.watchingDate,
        'favorite': film.userDetails.favorite,
      },
      'film_info': {
        'poster': film.poster,
        'title': film.title,
        'alternative_title': film.alternativeTitle,
        'total_rating': film.totalRating,
        'age_rating': film.ageRating,
        'director': film.director,
        'release': {
          'date': film.release.date,
          'release_country': film.release.releaseCountry,
        },
        'runtime': film.runtime,
        'writers': film.writers,
        'actors': film.actors,
        'genre': film.genres,
        'description': film.description,
      },
    };

    return adaptedFilm;
  }

  #load = async ({
    url,
    method = Method.GET,
    body = null,
    headers = new Headers(),
  }) => {
    headers.append('Authorization', this.#authorization);

    const response = await fetch(
      `${this.#endPoint}/${url}`,
      {method, body, headers},
    );

    try {
      ApiService.checkStatus(response);
      return response;
    } catch (err) {
      ApiService.catchError(err);
    }
  }

  static parseResponse = (response) => response.json();

  static checkStatus = (response) => {
    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }
  }

  static catchError = (err) => {
    throw err;
  }
}
