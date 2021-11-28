import { createHeaderTemplate } from './view/header-view.js';
import { createMenuTemplate } from './view/menu-view.js';
import { createSortTemplate } from './view/sort-view.js';
import { createFilmSectionTemplate } from './view/film-section-view.js';
import { createFooterTemplate } from './view/footer-view.js';
import { createFilmsContainerTemplate } from './view/films-container-view.js';
import { createFilmTemplate } from './view/film-view.js';
import { createButtonShowMoreTemplate } from './view/button-show-more-view.js';
import { renderTemplate } from './render.js';

const headerElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');

const footerElement = document.querySelector('.footer');

const FILMS_AMOUNT = 5;
const FILMS_EXTRA_AMOUNT = 2;

const FilmsTitle = {
  'full-list': 'All movies. Upcoming',
  'top-rated': 'Top rated',
  'most-commented': 'Most commented',
};

renderTemplate(headerElement, createHeaderTemplate());
renderTemplate(siteMainElement, createMenuTemplate());
renderTemplate(siteMainElement, createSortTemplate());
renderTemplate(footerElement, createFooterTemplate());

renderTemplate(siteMainElement, createFilmSectionTemplate());

const renderListFilms = (container, amount) => {
  for (let i = 0; i < amount; i++) {
    renderTemplate(container.children[1], createFilmTemplate());
  }
};

const buildContainer = (number, title, isExtra) => {
  const filmsContainerElement = siteMainElement.querySelector('.films');
  renderTemplate(filmsContainerElement, createFilmsContainerTemplate(title));
  const filmsListElement = filmsContainerElement.children[number];

  if (isExtra) {
    const listHeaderElement = filmsListElement.querySelector('.films-list__title');
    if (!filmsListElement.classList.contains('films-list--extra')) {
      filmsListElement.classList.add('films-list--extra');
    }
    if (listHeaderElement.classList.contains('visually-hidden')) {
      listHeaderElement.classList.remove('visually-hidden');
    }
    renderListFilms(filmsListElement, FILMS_EXTRA_AMOUNT);
  } else {
    renderListFilms(filmsListElement, FILMS_AMOUNT);
    renderTemplate(filmsListElement, createButtonShowMoreTemplate());
  }
};

const renderSectionFilms = () => {
  buildContainer(0, FilmsTitle['full-list'], false);
  buildContainer(1, FilmsTitle['top-rated'], true);
  buildContainer(2, FilmsTitle['most-commented'], true);
};

renderSectionFilms();

