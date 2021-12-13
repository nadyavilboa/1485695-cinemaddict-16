import HeaderLogoView from './view/header-logo-view.js';
import HeaderProfileView from './view/header-profile-view.js';
import MenuContainerView from './view/menu-container-view.js';
import MenuView from './view/menu-view.js';
import MenuStatsView from './view/menu-stats-view.js';
import SortView from './view/sort-view.js';
import FooterLogoView from './view/footer-logo-view';
import FooterStatisticsView from './view/footer-statistics-view.js';
import { generateFilm } from './mock/film.js';
import { getActualRank, generateFilters } from './utils/film.js';
import FilmsListPresenter from './presenter/films-list-presenter.js';
import { renderElement } from './utils/render.js';

const headerElement = document.body.querySelector('.header');
const siteMainElement = document.body.querySelector('.main');
const footerElement = document.body.querySelector('.footer');

const FILMS_COUNT_MULTIPLER = 130291;
const FILMS_GENERATED_AMOUNT = 20;

const FILMS_ALL_COUNT = FILMS_GENERATED_AMOUNT * FILMS_COUNT_MULTIPLER;

const films = Array.from({length: FILMS_GENERATED_AMOUNT}, generateFilm);

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

const filmListPresenter = new FilmsListPresenter(siteMainElement);
filmListPresenter.init(films);

