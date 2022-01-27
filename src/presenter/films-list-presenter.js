import loadingView from '../view/loading-view.js';
import FilmSectionView from '../view/film-section-view.js';
import FilmsContainerView from '../view/films-container-view.js';
import FilmsListContainerView from '../view/films-list-container-view.js';
import SortView from '../view/sort-view.js';
import ButtonShowMoreView from '../view/button-show-more-view.js';
import FilmPresenter from './film-presenter.js';
import { sortByAmountComments, sortByDate, sortByRating } from '../utils/common.js';
import { filterFilms } from '../utils/film.js';
import { renderElement, removeComponent } from '../utils/render.js';
import {
  FilmsTitle,
  SortType,
  UpdateType,
  UserAction,
  FILMS_AMOUNT_PER_STEP,
  FILMS_EXTRA_AMOUNT,
} from '../const.js';

export default class FilmsListPresenter {
  #siteMainElement = null;

  #filmsModel = null;
  #commentsModel = null;
  #filterModel = null;

  #sortMenuComponent = null;

  #loadingComponent = new loadingView();
  #buttonShowMoreComponent = new ButtonShowMoreView();
  #filmsSectionComponent = new FilmSectionView();

  #filmPresenter = new Map();
  #ratingPresenter = null;

  #currentSortType = SortType.DEFAULT;

  #renderedFilmsAmount = FILMS_AMOUNT_PER_STEP;

  #isLoading = true;

  constructor (siteMainElement, filmsModel, commentsModel, filterModel, ratingPresenter) {
    this.#siteMainElement = siteMainElement;

    this.#filmsModel = filmsModel;
    this.#commentsModel = commentsModel;
    this.#filterModel = filterModel;

    this.#ratingPresenter = ratingPresenter;
  }

  get films() {
    const currentFilter = this.#filterModel.filter;
    const films = this.#filmsModel.films;
    const filteredFilms = filterFilms(films, currentFilter);

    switch (this.#currentSortType) {
      case SortType.TO_DATE:
        return filteredFilms.sort(sortByDate);
      case SortType.TO_RATING:
        return filteredFilms.sort(sortByRating);
      default:
        return filteredFilms;
    }
  }

  init = () => {
    this.#renderSort();


    this.#filmsModel.addObserver(this.#handleModelEvent);
    this.#commentsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  destroy = () => {
    this.#clearFilmsSection();

    this.#filmsModel.removeObserver(this.#handleModelEvent);
    this.#commentsModel.removeObserver(this.#handleModelEvent);
    this.#filterModel.removeObserver(this.#handleModelEvent);
  }

  #renderLoading = () => {
    renderElement(this.#siteMainElement, this.#loadingComponent);
  }

  #renderSort = () => {
    this.#sortMenuComponent = new SortView(this.#currentSortType);
    this.#sortMenuComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);

    renderElement(this.#siteMainElement, this.#sortMenuComponent);
  }

  #renderSectionFilms = () => {
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    const films = this.films;
    const filmsCount = films.length;

    if (filmsCount === 0) {
      this.#buildEmptyContainer(FilmsTitle.EMPTY, true);
      return;
    }

    renderElement(this.#siteMainElement, this.#filmsSectionComponent);

    this.buildContainer(FilmsTitle.FULL, false, films);
    this.buildContainer(FilmsTitle.TOP_RATED, true, films.sort(sortByRating));
    this.buildContainer(FilmsTitle.MOST_COMMENTED, true, films.sort(sortByAmountComments));
  }

  buildContainer = (title, isExtra, filmsToRender) => {
    renderElement(this.#filmsSectionComponent, new FilmsContainerView(title, isExtra));
    const filmsListElement = this.#filmsSectionComponent.element.querySelector('.films-list:last-child');
    renderElement(filmsListElement, new FilmsListContainerView());

    if (isExtra) {
      this.#renderListFilms(filmsListElement, filmsToRender.slice(0, FILMS_EXTRA_AMOUNT));
    } else {
      this.#renderListFilms(filmsListElement, filmsToRender.slice(0,
        Math.min(this.#filmsModel.films.length, FILMS_AMOUNT_PER_STEP)));

      this.#renderButtonShowMore(filmsListElement, filmsToRender);
    }
  }

  #renderButtonShowMore = (filmsListElement, filmsToRender) => {
    let secondPartFilms = [];
    secondPartFilms = [...filmsToRender];

    if (filmsToRender.length > FILMS_AMOUNT_PER_STEP) {

      renderElement(filmsListElement, this.#buttonShowMoreComponent);

      this.#buttonShowMoreComponent.setClickHandler(() => {
        this.#showMoreFilms(secondPartFilms
          .slice(this.#renderedFilmsAmount, this.#renderedFilmsAmount + FILMS_AMOUNT_PER_STEP));

        this.#renderedFilmsAmount += FILMS_AMOUNT_PER_STEP;

        if (this.#renderedFilmsAmount >= filmsToRender.length) {
          removeComponent(this.#buttonShowMoreComponent);
        }
      });
    }
  }

  #buildEmptyContainer = (title, isExtra) => {
    renderElement(this.#filmsSectionComponent, new FilmsContainerView(title, isExtra));
  }

  #showMoreFilms = (filmsToRender) => {
    const filmsListElement = this.#filmsSectionComponent.element.querySelector('.films-list:first-child');
    this.#renderListFilms(filmsListElement, filmsToRender);
  }

  #renderListFilms = (container, filmsToRender) => {
    const filmsContainerElement = container.querySelector('.films-list__container');

    filmsToRender.forEach((film) => {
      this.#renderFilm(filmsContainerElement, film);
    });
  }

  #renderFilm = (filmsContainerElement, film) => {
    const filmPresenter = new FilmPresenter(filmsContainerElement, this.#handleViewAction, this.#handleModeChange, this.#commentsModel);
    filmPresenter.init(film);
    this.#filmPresenter.set(film.id, filmPresenter);
  }

  #handleModeChange = () => {
    this.#filmPresenter.forEach((presenter) => presenter.resetView());
  }

  #handleViewAction = (actionType, updateType, update, position) => {
    switch (actionType) {
      case UserAction.CHANGE_CONTROLS:
        this.#filmsModel.updateFilm(updateType, update);
        break;
      case UserAction.ADD_COMMENT:
        this.#commentsModel.addComment(updateType, update, position);
        break;
      case UserAction.DELETE_COMMENT:
        this.#commentsModel.deleteComment(updateType, update, position);
        break;
      default:
        throw new Error(`Unknown userActionType type ${actionType}`);
    }
  }

  #handleModelEvent = (updateType, data, position) => {
    switch (updateType) {
      case UpdateType.PATH:
        this.#filmPresenter.get(data.id).init(data, position);
        break;
      case UpdateType.MINOR:
        this.#renderSectionFilms();
        break;
      case UpdateType.MAJOR:
        removeComponent(this.#sortMenuComponent);
        this.#renderSort();
        //this.#ratingPresenter.destroy();
        //this.#ratingPresenter.init();
        this.#clearFilmsSection();
        this.#renderSectionFilms();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        removeComponent(this.#loadingComponent);
        this.#renderSectionFilms();
        break;
      default:
        throw new Error(`Unknown updateType type ${updateType}`);
    }
  }

  #clearFilmsSection = () => {
    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();

    this.#renderedFilmsAmount = FILMS_AMOUNT_PER_STEP;
    removeComponent(this.#filmsSectionComponent);
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;

    removeComponent(this.#sortMenuComponent);
    this.#renderSort();
    this.#clearFilmsSection();
    renderElement(this.#siteMainElement, this.#filmsSectionComponent);
    this.#renderSectionFilms();
  }

}
