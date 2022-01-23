import FilmSectionView from '../view/film-section-view.js';
import FilmsContainerView from '../view/films-container-view.js';
import FilmsListContainerView from '../view/films-list-container-view.js';
import SortView from '../view/sort-view.js';
import ButtonShowMoreView from '../view/button-show-more-view.js';
import FilmPresenter from './film-presenter.js';
import { sortByAmountComments, sortByDate, sortByRating } from '../utils/common.js';
import { filterFilms } from '../utils/film.js';
import { FilmsTitle, SortType, UpdateType, UserAction } from '../const.js';
import { renderElement, removeComponent } from '../utils/render.js';
import { countFilters } from '../main.js';

const FILMS_AMOUNT_PER_STEP = 5;
const FILMS_EXTRA_AMOUNT = 2;

export default class FilmsListPresenter {
  #siteMainElement = null;

  #filmsModel = null;
  #commentsModel = null;
  #filterModel = null;

  #sortMenuComponent = null;

  #buttonShowMoreComponent = new ButtonShowMoreView();
  #filmsSectionComponent = new FilmSectionView();

  #filmPresenter = new Map();

  #filterPresenter = null;

  #menuItem = null;
  #currentSortType = SortType.DEFAULT;

  #renderedFilmsAmount = FILMS_AMOUNT_PER_STEP;

  constructor (siteMainElement, filmsModel, commentsModel, filterModel) {
    this.#siteMainElement = siteMainElement;

    this.#filmsModel = filmsModel;
    this.#commentsModel = commentsModel;
    this.#filterModel = filterModel;
  }

  get films() {
    this.#menuItem = this.#filterModel.filter;
    const films = this.#filmsModel.films;
    const filteredFilms = filterFilms(films, this.#menuItem);

    switch (this.#currentSortType) {
      case SortType.TO_DATE:
        return films.sort(sortByDate);
      case SortType.TO_RATING:
        return films.sort(sortByRating);
      default:
        return films;
    }
  }

  get comments() {
    return this.#commentsModel.comments;
  }

  init = () => {

    this.#renderSectionFilms();

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

  #renderSort = () => {
    this.#sortMenuComponent = new SortView(this.#currentSortType);
    this.#sortMenuComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);

    if (this.#sortMenuComponent === null) {
      renderElement(this.#siteMainElement, this.#sortMenuComponent);
    }
  }

  #renderSectionFilms = () => {
    const films = this.films;
    const filmsCount = films.length;

    if (filmsCount === 0) {
      this.#buildEmptyContainer(FilmsTitle.EMPTY, true);
      return;
    }

    this.#renderSort();
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
        Math.min(this.films.length, FILMS_AMOUNT_PER_STEP)));

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
    const comments = this.comments;

    filmsToRender.forEach((film) => {
      this.#renderFilm(filmsContainerElement, film, comments);
    });
  }

  #renderFilm = (filmsContainerElement, film, comments) => {
    const filmPresenter = new FilmPresenter(filmsContainerElement, this.#handleViewAction, this.#handleModeChange, this.#commentsModel);
    filmPresenter.init(film, comments);
    this.#filmPresenter.set(film.id, filmPresenter);
  }

  #handleModeChange = () => {
    this.#filmPresenter.forEach((presenter) => presenter.resetView());
  }

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.CHANGE_CONTROLS:
        this.#filmsModel.updateFilm(updateType, update);
        break;
      case UserAction.ADD_COMMENT:
        this.#commentsModel.addComment(updateType, update);
        break;
      case UserAction.DELETE_COMMENT:
        this.#commentsModel.deleteComment(updateType, update);
        break;
      default:
        throw new Error(`Unknown userActionType type ${actionType}`);
    }
  }

  //выбран фильтр - MINOR_BIG_LIST - перерисовка основного списка
  //изменены контролы - MAJOR - перерисовка трёх списков и фильтров
  //добавлен/удален коммент - MINOR_ALL_LISTS - перерисовка трёх списков

  #handleModelEvent = (updateType) => {
    switch (updateType) {
      case UpdateType.MINOR_ALL_LISTS:
        this.#renderSectionFilms();
        break;
      case UpdateType.MAJOR:
        this.#renderSectionFilms();
        //this.#filterPresenter.destroy();
        //this.#filterPresenter.init();
        break;
      case UpdateType.MINOR_BIG_LIST:
        this.buildContainer(FilmsTitle.FULL, false, this.films);
        break;
      default:
        throw new Error(`Unknown updateType type ${updateType}`);
    }
  }

  #clearFilmsSection = () => {
    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();

    this.#renderedFilmsAmount = FILMS_AMOUNT_PER_STEP;
    removeComponent(this.#sortMenuComponent);
    removeComponent(this.#filmsSectionComponent);
  }

  //нужен метод очистки верхнего списка

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
