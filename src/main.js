import { createHeaderTemplate } from './view/header-view.js';
import { createMenuTemplate } from './view/menu-view.js';
import { createSortTemplate } from './view/sort-view.js';
import { createFilmSectionTemplate } from './view/film-section-view.js';
import { createFooterTemplate } from './view/footer-view.js';
import { createFilmsContainerTemplate } from './view/films-container-view.js';
import { createFilmTemplate } from './view/film-view.js';
import { createButtonShowMoreTemplate } from './view/button-show-more-view.js';
import { renderTemplate } from './render.js';
import { generateFilm } from './mock/film.js';

const headerElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');

const footerElement = document.querySelector('.footer');

const FILMS_AMOUNT = 5;
const FILMS_EXTRA_AMOUNT = 2;

const FILMS_GENERATED_AMOUNT = 20;

const FilmsTitle = {
  FULL: 'All movies. Upcoming',
  TOP_RATED: 'Top rated',
  MOST_COMMENTED: 'Most commented',
};

const films = Array.from({length: FILMS_GENERATED_AMOUNT}, generateFilm);

renderTemplate(headerElement, createHeaderTemplate());
renderTemplate(siteMainElement, createMenuTemplate());
renderTemplate(siteMainElement, createSortTemplate());
renderTemplate(footerElement, createFooterTemplate());

renderTemplate(siteMainElement, createFilmSectionTemplate());

const renderListFilms = (container, amount) => {
  const filmsContainerElement = container.querySelector('.films-list__container');

  for (let i = 0; i < amount; i++) {
    renderTemplate(filmsContainerElement, createFilmTemplate(films[i]));
  }
};

const buildContainer = (title, isExtra) => {
  const filmsSectionElement = siteMainElement.querySelector('.films');
  renderTemplate(filmsSectionElement, createFilmsContainerTemplate(title, isExtra));
  const filmsListElement = filmsSectionElement.querySelector('.films-list:last-child');

  if (isExtra) {
    renderListFilms(filmsListElement, FILMS_EXTRA_AMOUNT);
  } else {
    renderListFilms(filmsListElement, FILMS_AMOUNT);
    renderTemplate(filmsListElement, createButtonShowMoreTemplate());
  }
};

const renderSectionFilms = () => {
  buildContainer(FilmsTitle.FULL, false);
  buildContainer(FilmsTitle.TOP_RATED, true);
  buildContainer(FilmsTitle.MOST_COMMENTED, true);
};

renderSectionFilms();
