import FilmSectionView from '../view/film-section-view.js';
import FilmsContainerView from '../view/films-container-view.js';
import FilmsListContainerView from '../view/films-list-container-view.js';
import SortView from '../view/sort-view.js';
import ButtonShowMoreView from '../view/button-show-more-view.js';
import FilmPresenter from './film-presenter.js';
import { sortByAmountComments, sortByDate, sortByRating } from '../utils/common.js';
import { SortType, UpdateType, UserAction } from '../const.js';
import { renderElement, removeComponent } from '../utils/render.js';

const FILMS_AMOUNT_PER_STEP = 5;
const FILMS_EXTRA_AMOUNT = 2;

const FilmsTitle = {
  EMPTY: 'There are no movies in our database',
  FULL: 'All movies. Upcoming',
  TOP_RATED: 'Top rated',
  MOST_COMMENTED: 'Most commented',
};

export default class FilmsListPresenter {
  #siteMainElement = null;
  #filmsModel = null;
  #commentsModel = null;

  #sortMenuComponent = null;
  #buttonShowMoreComponent = new ButtonShowMoreView();
  #filmsSectionComponent = new FilmSectionView();

  #filmPresenter = new Map();
  #currentSortType = SortType.DEFAULT;

  #renderedFilmsAmount = FILMS_AMOUNT_PER_STEP;

  constructor (siteMainElement, filmsModel, commentsModel) {
    this.#siteMainElement = siteMainElement;
    this.#filmsModel = filmsModel;
    this.#commentsModel = commentsModel;
  }

  get films() {
    switch (this.#currentSortType) {
      case SortType.TO_DATE:
        return this.#filmsModel.films.sort(sortByDate);
      case SortType.TO_RATING:
        return this.#filmsModel.films.sort(sortByRating);
      default:
        return this.#filmsModel.films;
    }
  }

  get comments() {
    return this.#commentsModel.comments;
  }

  init = () => {
    this.#renderSectionFilms();

    this.#filmsModel.addObserver(this.#handleModelEvent);
    this.#commentsModel.addObserver(this.#handleModelEvent);
  }

  #renderSort = () => {
    this.#sortMenuComponent = new SortView(this.#currentSortType);
    this.#sortMenuComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
    renderElement(this.#siteMainElement, this.#sortMenuComponent);
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

    this.#buildContainer(FilmsTitle.FULL, false, films);
    this.#buildContainer(FilmsTitle.TOP_RATED, true, films.sort(sortByRating));
    this.#buildContainer(FilmsTitle.MOST_COMMENTED, true, films.sort(sortByAmountComments));
  }

  #buildContainer = (title, isExtra, filmsToRender) => {
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
    const filmPresenter = new FilmPresenter(filmsContainerElement, this.#handleViewAction, this.#handleModeChange);
    filmPresenter.init(film, comments);
    this.#filmPresenter.set(film.id, filmPresenter);
  }

  #handleModeChange = () => {
    this.#filmPresenter.forEach((presenter) => presenter.resetView());
  }

  #handleViewAction = (actionType, updateType, newComment = {}, updateFilm, commentId = '') => {
    switch (actionType) {
      case UserAction.CHANGE_CONTROLS:
        this.#filmsModel.updateFilmControls(updateType, updateFilmControls);
        break;
      case UserAction.ADD_COMMENT:
        this.#filmsModel.addCommentFilm(updateType, newComment, updateFilm);
        this.#commentsModel.addComment(updateType, newComment);
        break;
      case UserAction.DELETE_COMMENT:
        this.filmsModel.deleteCommentFilm(updateType, updateFilm, commentId);
        this.#commentsModel.deleteComment(updateType, commentId);
        break;
      default:
        throw new Error(`Unknown userActionType type ${actionType}`);
    }
  }

  #handleModelEvent = (updateType) => {
    switch (updateType) {
      case UpdateType.ALL_LISTS:
        this.#renderSectionFilms();
        break;
      case UpdateType.FILTERS_AND_LISTS:
        this.#renderSectionFilms();
        //ререндер меню фильтров
        break;
      case UpdateType.BIG_LIST:
        this.#buildContainer(FilmsTitle.FULL, false, this.films);
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
