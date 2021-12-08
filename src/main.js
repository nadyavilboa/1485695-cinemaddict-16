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
import PopupContainerView from './view/popup-container-view';
import PopupCloseButtonView from './view/popup-close-button-view.js';
import { generateFilm } from './mock/film.js';
import { addIdObjects, sortByKey } from './utils/common.js';
import { getActualRank, generateFilters } from './utils/film.js';
import { renderElement, removeComponent } from './utils/render.js';
import FilmsListContainerView from './view/films-list-container-view.js';

const body = document.querySelector('body');

const headerElement = body.querySelector('.header');
const siteMainElement = body.querySelector('.main');
const footerElement = body.querySelector('.footer');

const FILMS_AMOUNT_PER_STEP = 5;
const FILMS_EXTRA_AMOUNT = 2;

const FILMS_COUNT_MULTIPLER = 130291;
const FILMS_GENERATED_AMOUNT = 20;

const FILMS_ALL_COUNT = FILMS_GENERATED_AMOUNT * FILMS_COUNT_MULTIPLER;

const FilmsTitle = {
  EMPTY: 'There are no movies in our database',
  FULL: 'All movies. Upcoming',
  TOP_RATED: 'Top rated',
  MOST_COMMENTED: 'Most commented',
};

const films = Array.from({length: FILMS_GENERATED_AMOUNT}, generateFilm);

addIdObjects(films);

const filters = generateFilters(films);
const userRank = getActualRank(filters.history);

renderElement(headerElement, new HeaderLogoView());

if (films.length !== 0) {
  renderElement(headerElement, new HeaderProfileView(userRank));
}

const menuContainerComponent = new MenuContainerView();
renderElement(siteMainElement, menuContainerComponent);
renderElement(menuContainerComponent, new MenuView(filters));

renderElement(menuContainerComponent, new MenuStatsView());

renderElement(siteMainElement, new SortView());

renderElement(footerElement, new FooterLogoView());

renderElement(footerElement, new FooterStatisticsView(FILMS_ALL_COUNT));

const filmsSectionComponent = new FilmSectionView();
renderElement(siteMainElement, filmsSectionComponent);

const onEscKeyDown = (evt) => {
  if (evt.key === 'Escape' || evt.key === 'Esc') {
    evt.preventDefault();
    const popupContainerComponent = body.querySelector('.film-details');
    popupContainerComponent.remove();
    document.removeEventListener('keydown', onEscKeyDown);
  }
};

const renderPopup = (film) => {
  body.classList.add('hide-owerflow');
  document.addEventListener('keydown', onEscKeyDown);

  const popupContainerComponent = new PopupContainerView(film);
  renderElement(body, popupContainerComponent);

  const buttonContainer = body.querySelector('.film-details__close');
  const popupCloseButton = new PopupCloseButtonView();
  renderElement(buttonContainer, popupCloseButton);

  popupCloseButton.setClickHandler(() => {
    body.classList.remove('hide-owerflow');
    removeComponent(popupContainerComponent);
  });
};
const renderListFilms = (container, filmsToRender) => {
  const filmsContainerElement = container.querySelector('.films-list__container');

  filmsToRender.forEach((film) => {
    const filmCard = new FilmView(film);
    renderElement(filmsContainerElement, filmCard);
    filmCard.setClickHandler(() => renderPopup(film));
  });
};

const showMoreFilms = (filmsToRender) => {
  const filmsListElement = filmsSectionComponent.element.querySelector('.films-list:first-child');
  renderListFilms(filmsListElement, filmsToRender);
};

const buildEmptyContainer = (title, isExtra) => {
  renderElement(filmsSectionComponent, new FilmsContainerView(title, isExtra));
};

const buildContainer = (title, isExtra, filmsToRender) => {
  renderElement(filmsSectionComponent, new FilmsContainerView(title, isExtra));
  const filmsListElement = filmsSectionComponent.element.querySelector('.films-list:last-child');
  renderElement(filmsListElement, new FilmsListContainerView());

  if (isExtra) {
    renderListFilms(filmsListElement, filmsToRender.slice(0, FILMS_EXTRA_AMOUNT));
  } else {
    renderListFilms(filmsListElement, filmsToRender.slice(0, Math.min(films.length, FILMS_AMOUNT_PER_STEP)));

    if (filmsToRender.length > FILMS_AMOUNT_PER_STEP) {
      let renderedFilmsAmount = FILMS_AMOUNT_PER_STEP;

      const buttonShowMoreComponent = new ButtonShowMoreView();
      renderElement(filmsListElement, buttonShowMoreComponent);

      buttonShowMoreComponent.setClickHandler(() => {
        showMoreFilms(filmsToRender
          .slice(renderedFilmsAmount, renderedFilmsAmount + FILMS_AMOUNT_PER_STEP));

        renderedFilmsAmount += FILMS_AMOUNT_PER_STEP;

        if (renderedFilmsAmount >= filmsToRender.length) {
          removeComponent(buttonShowMoreComponent);
        }
      });
    }
  }
};

const renderSectionFilms = () => {
  if (films.length !== 0) {
    buildContainer(FilmsTitle.FULL, false, films);
    buildContainer(FilmsTitle.TOP_RATED, true, sortByKey(films, 'totalRating', 'value'));
    buildContainer(FilmsTitle.MOST_COMMENTED, true, sortByKey(films, 'comments', 'valueArray'));
  } else {
    buildEmptyContainer(FilmsTitle.EMPTY, true);
  }
};

renderSectionFilms();
