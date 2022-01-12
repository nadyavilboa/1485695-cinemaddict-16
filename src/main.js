import HeaderLogoView from './view/header-logo-view.js';
import HeaderProfileView from './view/header-profile-view.js';
import MenuContainerView from './view/menu-container-view.js';
import MenuView from './view/menu-view.js';
import MenuStatsView from './view/menu-stats-view.js';
import FooterLogoView from './view/footer-logo-view';
import FooterStatisticsView from './view/footer-statistics-view.js';
import { generateFilm } from './mock/film.js';
import { generateComment } from './mock/comments.js';
import { generateFilters } from './utils/film.js';
import FilmsListPresenter from './presenter/films-list-presenter.js';
import FilmsModel from './model/films-model.js';
import CommentsModel from './model/comments-model.js';
import { MenuItem } from './const.js';
import { renderElement, removeComponent } from './utils/render.js';
import StatisticsView from './view/stats-view.js';

const headerElement = document.body.querySelector('.header');
const siteMainElement = document.body.querySelector('.main');
const footerElement = document.body.querySelector('.footer');

const FILMS_COUNT_MULTIPLER = 130291;
const FILMS_GENERATED_AMOUNT = 20;

const COMMENTS_GENERATED_AMOUNT = 100;

const FILMS_ALL_COUNT = FILMS_GENERATED_AMOUNT * FILMS_COUNT_MULTIPLER;

export const comments = Array.from({length: COMMENTS_GENERATED_AMOUNT}, generateComment);

const commentsModel = new CommentsModel();
commentsModel.comments = comments;

const films = Array.from({length: FILMS_GENERATED_AMOUNT}, generateFilm);

const filmsModel = new FilmsModel();
filmsModel.films = films;

const filters = generateFilters(films);

const menuContainerComponent = new MenuContainerView();

const filmListPresenter = new FilmsListPresenter(siteMainElement, filmsModel, commentsModel);

let statisticsComponent = null;

const handleMenuClick = (menuItem) => {
  if (menuItem === MenuItem.STATS) {
    filmListPresenter.destroy();
    statisticsComponent = new StatisticsView(filmsModel.films);
    renderElement(siteMainElement, statisticsComponent);
    return;
  }

  removeComponent(statisticsComponent);
  filmListPresenter.destroy();
  filmListPresenter.init();
  //destroy и init presenter-а filters

  switch (menuItem) {
    case MenuItem.ALL_MOVIES:
      //фильтр все фильмы
      //показать секцию фильмов
      break;
    case MenuItem.WATCHLIST:
      //фильтр wL
      //показать секцию фильмов
      break;
    case MenuItem.WATCHED:
      //фильтр wD
      //показать секцию фильмов
      break;
    case MenuItem.FAVORITES:
      //фильтр fv
      //показать секцию фильмов
      break;
    default:
      throw new Error(`Unknown menuItem type ${menuItem}`);
  }
};

renderElement(headerElement, new HeaderLogoView());
renderElement(headerElement, new HeaderProfileView(filters.history, films));

renderElement(siteMainElement, menuContainerComponent);
renderElement(menuContainerComponent, new MenuView(filters));
renderElement(menuContainerComponent, new MenuStatsView());
renderElement(footerElement, new FooterLogoView());
renderElement(footerElement, new FooterStatisticsView(FILMS_ALL_COUNT));

menuContainerComponent.setMenuClickHandler(handleMenuClick);

//запуск презентера фильтров
filmListPresenter.init();
