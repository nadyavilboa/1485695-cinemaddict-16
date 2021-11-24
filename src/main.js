import { createHeaderProfileTemplate } from './view/header-profile-view.js';
import { createSiteMenuTemplate } from './view/site-menu-view.js';
import { createSortTemplate } from './view/sort-films-view.js';
import { createItemFilmTemplate } from './view/item-film-view.js';
import { createButtonShowMoreTemplate } from './view/button-show-more-view.js';
import { createTopRatedTemplate } from './view/film-top-rated-view.js';
import { createMostCommentedTemplate } from './view/film-most-commented-view.js';
import { createFooterStatisticTemplate } from './view/statistic-movies-view.js';
import { renderTemplate, RenderPosition } from './render.js';

const siteHeaderElement = document.querySelector('.header');
const headerProfileElement = siteHeaderElement.querySelector('.header__profile');
const siteMainElement = document.querySelector('.main');
const siteMenuElement = siteMainElement.querySelector('.main__menu');
const sortElement = siteMainElement.querySelector('.main__sort');
const filmsListElement = siteMainElement.querySelector('.films-list');
const filmContainerElement = filmsListElement.querySelector('.films-list__container');
const filmsTopRatedElement = siteMainElement.querySelector('.top-rated');
const filmsTopContainerElement = filmsTopRatedElement.querySelector('.films-top');
const filmsMostCommentedElement = siteMainElement.querySelector('.most-commented');
const filmsCommentedContainerElement = filmsMostCommentedElement.querySelector('.films-commented');
const footerStatistic = document.querySelector('.footer__statistics');

const FILMS_COUNT = 5;

renderTemplate(headerProfileElement, createHeaderProfileTemplate(), RenderPosition.BEFOREEND);
renderTemplate(siteMenuElement, createSiteMenuTemplate(), RenderPosition.BEFOREEND);
renderTemplate(sortElement, createSortTemplate(), RenderPosition.BEFOREEND);

for (let i = 0; i < FILMS_COUNT; i++) {
  renderTemplate(filmContainerElement, createItemFilmTemplate(), RenderPosition.BEFOREEND);
}

renderTemplate(filmsListElement, createButtonShowMoreTemplate(), RenderPosition.BEFOREEND);

renderTemplate(filmsTopContainerElement, createTopRatedTemplate(), RenderPosition.BEFOREEND);
renderTemplate(filmsCommentedContainerElement, createMostCommentedTemplate(), RenderPosition.BEFOREEND);

renderTemplate(footerStatistic, createFooterStatisticTemplate(), RenderPosition.BEFOREEND);
