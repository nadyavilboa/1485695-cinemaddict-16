import { createHeaderTemplate } from './view/header-view.js';
import { createMenuTemplate } from './view/menu-view.js';
import { createSortTemplate } from './view/sort-view.js';
import { createFilmsContainerTemplate } from './view/films-container-view.js';
import { renderSectionFilms } from './view/render-films-list.js';
import { createFooterTemplate } from './view/footer-view.js';
import { renderTemplate, RenderPosition } from './render.js';

const headerElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');

const footerElement = document.querySelector('.footer');

renderTemplate(headerElement, createHeaderTemplate(), RenderPosition.BEFORE_END);
renderTemplate(siteMainElement, createMenuTemplate(), RenderPosition.BEFORE_END);
renderTemplate(siteMainElement, createSortTemplate(), RenderPosition.BEFORE_END);

renderTemplate(siteMainElement, createFilmsContainerTemplate(), RenderPosition.BEFORE_END);
renderSectionFilms();
renderTemplate(footerElement, createFooterTemplate(), RenderPosition.BEFORE_END);
