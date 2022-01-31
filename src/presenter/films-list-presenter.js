import LoadingView from '../view/loading-view.js';
import FilmSectionView from '../view/film-section-view.js';
import FilmsContainerView from '../view/films-container-view.js';
import FilmsListContainerView from '../view/films-list-container-view.js';
import SortView from '../view/sort-view.js';
import ButtonShowMoreView from '../view/button-show-more-view.js';
import FilmPresenter from './film-presenter.js';
import { sortByDate, sortByRating } from '../utils/common.js';
import { filterFilms } from '../utils/film.js';
import { renderElement, removeComponent } from '../utils/render.js';
import {
  FilmsTitle,
  SortType,
  UpdateType,
  UserAction,
  FILMS_AMOUNT_PER_STEP,
  FILMS_EXTRA_AMOUNT,
  MenuItem,
} from '../const.js';

export default class FilmsListPresenter {
  #siteMainElement = null;

  #filmsModel = null;
  #commentsModel = null;
  #filterModel = null;

  #sortMenuComponent = null;

  #loadingComponent = new LoadingView();
  #buttonShowMoreComponent = new ButtonShowMoreView();
  #filmsSectionComponent = new FilmSectionView();

  #filmPresenter = new Map();

  #currentSortType = SortType.DEFAULT;

  #renderedFilmsAmount = FILMS_AMOUNT_PER_STEP;


  constructor (siteMainElement, filmsModel, commentsModel, filterModel) {
    this.#siteMainElement = siteMainElement;

    this.#filmsModel = filmsModel;
    this.#commentsModel = commentsModel;
    this.#filterModel = filterModel;

  }

  get films() {
    const currentFilter = this.#filterModel.filter;
    const films = this.#filmsModel.films;
    const filteredFilms = filterFilms(films, currentFilter);
    const copyFilteredFilms = filteredFilms.slice();

    switch (this.#currentSortType) {
      case SortType.TO_DATE:
        return copyFilteredFilms.sort(sortByDate);
      case SortType.TO_RATING:
        return copyFilteredFilms.sort(sortByRating);
      default:
        return filteredFilms;
    }
  }

  init = () => {
    this.#renderLoading();

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

  #removeSort = () => {
    removeComponent(this.#sortMenuComponent);
    this.#sortMenuComponent = null;
  }

  #renderSectionFilms = () => {
    const films = this.films;
    const filmsCount = films.length;
    const currentFilter = this.#filterModel.filter;

    this.#renderSort();

    renderElement(this.#siteMainElement, this.#filmsSectionComponent);

    if (filmsCount === 0) {
      this.#removeSort();

      switch (currentFilter) {
        case MenuItem.ALL:
          this.#buildEmptyContainer(FilmsTitle.EMPTY_FULL, true);
          break;
        case MenuItem.WATCHLIST:
          this.#buildEmptyContainer(FilmsTitle.EMPTY_WATCHLIST, true);
          break;
        case MenuItem.HISTORY:
          this.#buildEmptyContainer(FilmsTitle.EMPTY_HISTORY, true);
          break;
        case MenuItem.FAVORITES:
          this.#buildEmptyContainer(FilmsTitle.EMPTY_FAVORITES, true);
          break;
        default:
          throw new Error(`Unknown filter type ${currentFilter}`);
      }

      return;
    }

    this.buildContainer(FilmsTitle.FULL, false, films);
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
        this.#filmsModel.updateFilm(updateType, update, position);
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
      case UpdateType.MAJOR:
        removeComponent(this.#sortMenuComponent);
        removeComponent(this.#loadingComponent);
        this.#currentSortType = SortType.DEFAULT;
        this.#clearFilmsSection();
        this.#renderSectionFilms();
        break;
      case UpdateType.INIT:
        removeComponent(this.#loadingComponent);
        this.#clearFilmsSection();
        this.#renderSectionFilms();
        break;
      default:
        throw new Error(`Unknown updateType type ${updateType}`);
    }
  }

  #clearFilmsSection = () => {
    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();

    this.#removeSort();
    this.#renderedFilmsAmount = FILMS_AMOUNT_PER_STEP;
    removeComponent(this.#filmsSectionComponent);
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;

    this.#clearFilmsSection();
    renderElement(this.#siteMainElement, this.#filmsSectionComponent);
    this.#renderSectionFilms();
  }

}
