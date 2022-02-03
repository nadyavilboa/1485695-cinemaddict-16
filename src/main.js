import FilmsListPresenter from './presenter/films-list-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import FilmsModel from './model/films-model.js';
import CommentsModel from './model/comments-model.js';
import FilterModel from './model/filter-model.js';
import HeaderLogoView from './view/header-logo-view.js';
import MenuView from './view/menu-view.js';
import StatisticsView from './view/statistics-view.js';
import FooterLogoView from './view/footer-logo-view';
import FooterStatisticsView from './view/footer-statistics-view.js';
import { getActualRank } from './utils/film.js';
import { getWatchedFilms } from './utils/statistics.js';
import { renderElement, removeComponent } from './utils/render.js';
import { ApiParameters, MenuItem, StatisticsPeriods } from './const.js';
import ApiService from './api-service.js';
import RatingPresenter from './presenter/rating-presenter.js';

const headerElement = document.body.querySelector('.header');
const siteMainElement = document.body.querySelector('.main');
const footerElement = document.body.querySelector('.footer');

const commentsModel = new CommentsModel(new ApiService(ApiParameters.END_POINT, ApiParameters.AUTHORIZATION));
const filmsModel = new FilmsModel(new ApiService(ApiParameters.END_POINT, ApiParameters.AUTHORIZATION));
const filterModel = new FilterModel();

const menuComponent = new MenuView();

const ratingPresenter = new RatingPresenter(headerElement, filmsModel);
const filmsListPresenter = new FilmsListPresenter(siteMainElement, filmsModel, commentsModel, filterModel);
const filterPresenter = new FilterPresenter(menuComponent, filmsModel, filterModel);

let statisticsComponent = null;

const handleMenuClick = (menuItem) => {
  if (menuItem === MenuItem.STATS) {
    filmsListPresenter.destroy();
    const watchedFilms = getWatchedFilms(filmsModel.films);
    const userRank = getActualRank(watchedFilms.length);
    statisticsComponent = new StatisticsView(watchedFilms, userRank, StatisticsPeriods[0].value);
    renderElement(siteMainElement, statisticsComponent);
    statisticsComponent.render();
    return;
  }

  removeComponent(statisticsComponent);
  filmsListPresenter.destroy();
  filmsListPresenter.init();
};

renderElement(headerElement, new HeaderLogoView());

renderElement(siteMainElement, menuComponent);

menuComponent.setClickHandler(handleMenuClick);

renderElement(footerElement, new FooterLogoView());

filterPresenter.init();
filmsListPresenter.init();

filmsModel.init().finally(() => {
  ratingPresenter.init();
  renderElement(footerElement, new FooterStatisticsView(filmsModel.films.length));
});
