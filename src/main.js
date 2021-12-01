import { createHeaderTemplate } from './view/header-view.js';
import { createMenuTemplate } from './view/menu-view.js';
import { createFilterItemTemplate } from './view/filter-view.js';
import { createSortTemplate } from './view/sort-view.js';
import { createFilmSectionTemplate } from './view/film-section-view.js';
import { createFooterTemplate } from './view/footer-view.js';
import { createFilmsContainerTemplate } from './view/films-container-view.js';
import { createFilmTemplate } from './view/film-view.js';
import { createButtonShowMoreTemplate } from './view/button-show-more-view.js';
import { createPopupInfoContainerTemplate } from './view/popup-info-container-view';
import { createPopupInfoGenreTemplate } from './view/popup-info-genre-view.js';
import { createPopupControlsTemplate } from './view/popup-controls-view.js';
import { createPopupCommentsContainerTemplate } from './view/popup-commets-container-view.js';
import { createPopupCommentTemplate } from './view/popup-comment-view.js';
import { generateFilm } from './mock/film.js';
import { generateComment } from './mock/comment.js';
import { addIdObjects, getActualRank } from './utils.js';
import { generateFilters } from './mock/filter.js';
import { renderTemplate } from './render.js';

const headerElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');

const footerElement = document.querySelector('.footer');

const FILTER_USER_RATING = 'History';

const FILMS_AMOUNT_PER_STEP = 5;
const FILMS_EXTRA_AMOUNT = 2;

const FILMS_GENERATED_AMOUNT = 20;
const COMMENTS_GENERATED_AMOUNT = 50;

const FILMS_ALL_COUNT = 130291;

const FilmsTitle = {
  FULL: 'All movies. Upcoming',
  TOP_RATED: 'Top rated',
  MOST_COMMENTED: 'Most commented',
};

const films = Array.from({length: FILMS_GENERATED_AMOUNT}, generateFilm);
addIdObjects(films);

const comments = Array.from({length: COMMENTS_GENERATED_AMOUNT}, generateComment);
addIdObjects(comments);

const filters = generateFilters(films);

const userWatched = filters.find((filter) => filter.name === FILTER_USER_RATING).count;
const userRank = getActualRank(userWatched);
renderTemplate(headerElement, createHeaderTemplate(userRank));

renderTemplate(siteMainElement, createMenuTemplate());
const filterContainerElement = siteMainElement.querySelector('.main-navigation__items');
let isCountVisible = false;
filters.forEach((filter) => {
  renderTemplate(filterContainerElement, createFilterItemTemplate(filter, isCountVisible));
  isCountVisible = true;
});

renderTemplate(siteMainElement, createSortTemplate());
renderTemplate(footerElement, createFooterTemplate(FILMS_ALL_COUNT));

renderTemplate(siteMainElement, createFilmSectionTemplate());

const renderListFilms = (container, amount, index) => {
  const filmsContainerElement = container.querySelector('.films-list__container');

  for (let i = index; i < index + amount; i++) {
    renderTemplate(filmsContainerElement, createFilmTemplate(films[i]));
  }
};

const showMoreFilms = (index) => {
  const filmsSectionElement = siteMainElement.querySelector('.films');
  const filmsListElement = filmsSectionElement.querySelector('.films-list:first-child');
  renderListFilms(filmsListElement, FILMS_AMOUNT_PER_STEP, index);
};

const buildContainer = (title, isExtra) => {
  const filmsSectionElement = siteMainElement.querySelector('.films');
  renderTemplate(filmsSectionElement, createFilmsContainerTemplate(title, isExtra));
  const filmsListElement = filmsSectionElement.querySelector('.films-list:last-child');

  if (isExtra) {
    renderListFilms(filmsListElement, FILMS_EXTRA_AMOUNT, 0);
  } else {
    renderListFilms(filmsListElement, Math.min(films.length,FILMS_AMOUNT_PER_STEP), 0);

    if(films.length > FILMS_AMOUNT_PER_STEP) {
      let renderedFilmsAmount = FILMS_AMOUNT_PER_STEP;
      renderTemplate(filmsListElement, createButtonShowMoreTemplate());

      const buttonShowMoreElement = filmsListElement.querySelector('.films-list__show-more');

      buttonShowMoreElement.addEventListener('click', (evt) => {
        evt.preventDefault();
        showMoreFilms(renderedFilmsAmount);

        renderedFilmsAmount += FILMS_AMOUNT_PER_STEP;

        if (renderedFilmsAmount >= films.length) {
          buttonShowMoreElement.remove();
        }
      });
    }
  }
};

const renderSectionFilms = () => {
  buildContainer(FilmsTitle.FULL, false);
  buildContainer(FilmsTitle.TOP_RATED, true);
  buildContainer(FilmsTitle.MOST_COMMENTED, true);
};

const renderPopupFilm = (film) => {
  const popupElement = document.querySelector('.film-details');
  const popupFormElement = popupElement.querySelector('.film-details__inner');

  renderTemplate(popupFormElement, createPopupInfoContainerTemplate(film));

  const filmTableRowElement = popupFormElement.querySelector('.film-details__row:last-child');
  const filmsInfoGenreElement = filmTableRowElement.querySelector('.film-details__cell');
  for (let i = 0; i < film.genre.length; i++) {
    renderTemplate(filmsInfoGenreElement, createPopupInfoGenreTemplate(film.genre[i]));
  }

  renderTemplate(popupFormElement, createPopupControlsTemplate(film.userDetails));

  renderTemplate(popupFormElement, createPopupCommentsContainerTemplate(film.commentsCount));
  const commentContainerElement = popupFormElement.querySelector('.film-details__comments-wrap');
  const commentListElement = commentContainerElement.querySelector('.film-details__comments-list');
  for (let i = 0; i < film.commentsCount; i++) {
    renderTemplate(commentListElement, createPopupCommentTemplate(comments[i]));
  }
};

renderSectionFilms();

renderPopupFilm(films[0]);
