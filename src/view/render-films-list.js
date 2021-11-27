import { createItemFilmTemplate } from './film-view.js';
import { createButtonShowMoreTemplate } from './button-show-more-view.js';
import { renderTemplate, RenderPosition } from '../render.js';

const siteMainElement = document.querySelector('.main');

const FILMS_COUNT = 5;

const renderListFilms = (container) => {
  if (container.id === 'full-list') {
    for (let i = 0; i < FILMS_COUNT; i++) {
      renderTemplate(container.children[1], createItemFilmTemplate(), RenderPosition.BEFORE_END);
    }
    renderTemplate(container, createButtonShowMoreTemplate(), RenderPosition.BEFORE_END);
  } if (container.id === 'top-rated') {
    renderTemplate(container.children[1], createItemFilmTemplate(), RenderPosition.BEFORE_END);
  } if (container.id === 'most-commented') {
    renderTemplate(container.children[1], createItemFilmTemplate(), RenderPosition.BEFORE_END);
  }
};

const renderSectionFilms = () => {
  const filmsContainer = siteMainElement.querySelector('.films');
  const filmsListElement = filmsContainer.querySelectorAll('.films-list');
  for(let i = 0; i < filmsListElement.length; i++){
    renderListFilms(filmsListElement[i]);
  }
};

export { renderSectionFilms };
