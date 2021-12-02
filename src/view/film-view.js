export const createFilmTemplate = (film) => (
  `<article class="film-card">
    <a class="film-card__link">
      <h3 class="film-card__title">${film.title}</h3>
      <p class="film-card__rating">${film.totalRating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${film.release.date}</span>
        <span class="film-card__duration">${film.runtime}</span>
        <span class="film-card__genre">${film.genres.join(', ')}</span>
      </p>
      <img src="${film.poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${film.description.length > 139 ? film.description.slice(0,138) : film.description}</p>
      <span class="film-card__comments">${film.commentsCount} comments</span>
    </a>
    <div class="film-card__controls">
      <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${film.userDetails.watchlist ? 'film-card__controls-item--active' : ''}" type="button">${film.userDetails.watchlist ? 'Added to watchlist' : 'Add to watchlist'}</button>
      <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${film.userDetails.watched ? 'film-card__controls-item--active' : ''}" type="button">${film.userDetails.watched ? 'Marked watched' : 'Mark as watchlist'}</button>
      <button class="film-card__controls-item film-card__controls-item--favorite ${film.userDetails.favorite ? 'film-card__controls-item--active' : ''}" type="button">${film.userDetails.watchlist ? 'Marked favorite' : 'Mark as favorite'}</button>
    </div>
  </article>`
);
