import HeaderLogoView from './view/header-logo-view.js';
import HeaderProfileView from './view/header-profile-view.js';
import MenuContainerView from './view/menu-container-view.js';
import MenuView from './view/menu-view.js';
import MenuStatsView from './view/menu-stats-view.js';
import SortView from './view/sort-view.js';
import FilmSectionView from './view/film-section-view.js';
import FooterLogoView from './view/footer-logo-view';
import FooterStatisticsView from './view/footer-statistics-view.js';
import FilmsContainerView from './view/films-container-view.js';
import FilmView from './view/film-view.js';
import ButtonShowMoreView from './view/button-show-more-view.js';
import { generateFilm } from './mock/film.js';
import { addIdObjects, getActualRank, generateFilters } from './utils.js';
import { filmClickHandler } from './popup.js';
import { renderElement } from './render.js';

const headerElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');

const footerElement = document.querySelector('.footer');

const FILMS_AMOUNT_PER_STEP = 5;
const FILMS_EXTRA_AMOUNT = 2;

const FILMS_GENERATED_AMOUNT = 20;

const FILMS_ALL_COUNT = 130291;

const FilmsTitle = {
  FULL: 'All movies. Upcoming',
  TOP_RATED: 'Top rated',
  MOST_COMMENTED: 'Most commented',
};

export const films = Array.from({length: FILMS_GENERATED_AMOUNT}, generateFilm);
addIdObjects(films);

const filters = generateFilters(films);
const userRank = getActualRank(filters.history);

renderElement(headerElement, new HeaderLogoView().element);
renderElement(headerElement, new HeaderProfileView(userRank).element);

const menuContainerComponent = new MenuContainerView();
renderElement(siteMainElement, menuContainerComponent.element);
renderElement(menuContainerComponent.element, new MenuView(filters).element);

renderElement(menuContainerComponent.element, new MenuStatsView().element);

renderElement(siteMainElement, new SortView().element);

renderElement(footerElement, new FooterLogoView().element);
renderElement(footerElement, new FooterStatisticsView(FILMS_ALL_COUNT).element);

const filmsSectionComponent = new FilmSectionView();
renderElement(siteMainElement, filmsSectionComponent.element);

const renderListFilms = (container, amount, index = 0) => {
  const filmsContainerElement = container.querySelector('.films-list__container');

  for (let i = index; i < index + amount; i++) {
    renderElement(filmsContainerElement, new FilmView(films[i]).element);
  }
};

const showMoreFilms = (index) => {
  const filmsListElement = filmsSectionComponent.element.querySelector('.films-list:first-child');
  renderListFilms(filmsListElement, FILMS_AMOUNT_PER_STEP, index);
};

const buildContainer = (title, isExtra) => {
  renderElement(filmsSectionComponent.element, new FilmsContainerView(title, isExtra).element);
  const filmsListElement = filmsSectionComponent.element.querySelector('.films-list:last-child');

  if (isExtra) {
    renderListFilms(filmsListElement, FILMS_EXTRA_AMOUNT);
  } else {
    renderListFilms(filmsListElement, Math.min(films.length, FILMS_AMOUNT_PER_STEP));

    if (films.length > FILMS_AMOUNT_PER_STEP) {
      let renderedFilmsAmount = FILMS_AMOUNT_PER_STEP;

      const buttonShowMoreComponent = new ButtonShowMoreView();
      renderElement(filmsListElement, buttonShowMoreComponent.element);

      buttonShowMoreComponent.element.addEventListener('click', (evt) => {
        evt.preventDefault();
        showMoreFilms(renderedFilmsAmount);

        renderedFilmsAmount += FILMS_AMOUNT_PER_STEP;

        if (renderedFilmsAmount >= films.length) {
          buttonShowMoreComponent.element.remove();
          buttonShowMoreComponent.removeElement();
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

renderSectionFilms();

//после рендеринга фильмов, ищем коллекцию списков фильмов (три списка)
//и обвешиваем обработчиками
const filmsListsElement = siteMainElement.querySelectorAll('.films-list__container');
filmsListsElement.forEach((filmsList) =>
  filmsList.addEventListener('click', (evt) => filmClickHandler(evt)));
