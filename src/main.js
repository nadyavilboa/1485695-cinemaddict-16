import FilmsListPresenter from './presenter/films-list-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import FilmsModel from './model/films-model.js';
import CommentsModel from './model/comments-model.js';
import FilterModel from './model/filter-model.js';
import HeaderLogoView from './view/header-logo-view.js';
import HeaderProfileView from './view/header-profile-view.js';
import MenuContainerView from './view/menu-container-view.js';
import MenuView from './view/filters-menu-view.js';
import MenuStatsView from './view/menu-stats-view.js';
import StatisticsView from './view/stats-view.js';
import FooterLogoView from './view/footer-logo-view';
import FooterStatisticsView from './view/footer-statistics-view.js';
import { generateFilm } from './mock/film.js';
import { generateComment } from './mock/comments.js';
import { countFiltersValue, filterFilms, getActualRank } from './utils/film.js';
import { getWatchedFilms } from './utils/statistics.js';
import { renderElement, removeComponent } from './utils/render.js';
import { FilmsTitle, MenuItem, StatisticsPeriods } from './const.js';

const headerElement = document.body.querySelector('.header');
const siteMainElement = document.body.querySelector('.main');
const footerElement = document.body.querySelector('.footer');

const FILMS_GENERATED_AMOUNT = 20;

const COMMENTS_GENERATED_AMOUNT = 100;

export const comments = Array.from({length: COMMENTS_GENERATED_AMOUNT}, generateComment);

const commentsModel = new CommentsModel();

const films = Array.from({length: FILMS_GENERATED_AMOUNT}, generateFilm);

const filmsModel = new FilmsModel();
filmsModel.films = films;

export const countFilters = countFiltersValue(filmsModel.films);

const filterModel = new FilterModel();

const menuContainerComponent = new MenuContainerView();
const filtersMenuComponent = new MenuView(countFilters);
const menuStatsComponent = new MenuStatsView();

const filmsListPresenter = new FilmsListPresenter(siteMainElement, filmsModel, commentsModel, filterModel);
const filterPresenter = new FilterPresenter(menuContainerComponent, filmsModel, filterModel);

let statisticsComponent = null;

const handleMenuClick = (menuItem) => {
  if (menuItem === MenuItem.STATS) {
    filmsListPresenter.destroy();
    filterPresenter.destroy();

    const watchedFilms = getWatchedFilms(filmsModel.films);
    const userRank = getActualRank(watchedFilms.length);
    statisticsComponent = new StatisticsView(watchedFilms, userRank, StatisticsPeriods[0].value);
    renderElement(siteMainElement, menuContainerComponent);
    renderElement(menuContainerComponent, filtersMenuComponent);
    renderElement(menuContainerComponent, menuStatsComponent);
    renderElement(siteMainElement, statisticsComponent);
    statisticsComponent.render();
    return;
  }

  removeComponent(statisticsComponent);
  filmsListPresenter.destroy();
  filmsListPresenter.init();

  filterPresenter.destroy();
  filterPresenter.init();

  let filteredFilms = [];

  switch (menuItem) {
    case MenuItem.ALL_MOVIES:
      filteredFilms = [...filterFilms(this.films, MenuItem.ALL_MOVIES)];
      break;
    case MenuItem.WATCHLIST:
      filteredFilms = [...filterFilms(this.films, MenuItem.WATCHLIST)];
      break;
    case MenuItem.HISTORY:
      filteredFilms = [...filterFilms(this.films, MenuItem.HISTORY)];
      break;
    case MenuItem.FAVORITES:
      filteredFilms = [...filterFilms(this.films, MenuItem.FAVORITES)];
      break;
    default:
      throw new Error(`Unknown menuItem type ${menuItem}`);
  }
  //filterPresenter.destroy();
  //filterPresenter.init();
  //filmsListPresenter.buildContainer(FilmsTitle.FULL, false, filteredFilms);
};

renderElement(headerElement, new HeaderLogoView());
renderElement(headerElement, new HeaderProfileView(countFilters.history, filmsModel.films));

renderElement(siteMainElement, menuContainerComponent);

menuContainerComponent.setMenuClickHandler(handleMenuClick);

renderElement(footerElement, new FooterLogoView());
renderElement(footerElement, new FooterStatisticsView(FILMS_GENERATED_AMOUNT));

filterPresenter.init();
renderElement(menuContainerComponent, menuStatsComponent);
filmsListPresenter.init();
