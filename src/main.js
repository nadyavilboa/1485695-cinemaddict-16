import FilmsListPresenter from './presenter/films-list-presenter.js';
import FilmsModel from './model/films-model.js';
import CommentsModel from './model/comments-model.js';
import FilterModel from './model/filter-model.js';
import HeaderLogoView from './view/header-logo-view.js';
import HeaderProfileView from './view/header-profile-view.js';
import FooterLogoView from './view/footer-logo-view';
import FooterStatisticsView from './view/footer-statistics-view.js';
import { generateFilm } from './mock/film.js';
import { generateComment } from './mock/comments.js';
import { countFiltersValue } from './utils/film.js';
import { renderElement } from './utils/render.js';

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

export const countFilters = countFiltersValue(filmsModel.films);

const filterModel = new FilterModel();

const filmListPresenter = new FilmsListPresenter(siteMainElement, filmsModel, commentsModel, filterModel);

renderElement(headerElement, new HeaderLogoView());
renderElement(headerElement, new HeaderProfileView(countFilters.history, filmsModel.films));

renderElement(footerElement, new FooterLogoView());
renderElement(footerElement, new FooterStatisticsView(FILMS_ALL_COUNT));

filmListPresenter.init();
