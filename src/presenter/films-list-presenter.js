import FilmSectionView from '../view/film-section-view.js';
import FilmsContainerView from '../view/films-container-view.js';
import FilmsListContainerView from '../view/films-list-container-view.js';
import SortView from '../view/sort-view.js';
import ButtonShowMoreView from '../view/button-show-more-view.js';
import FilmPresenter from './film-presenter.js';
import { sortByAmountComments, sortByDate, sortByRating, updateItem } from '../utils/common.js';
import { SortType } from '../const.js';
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
  #films = [];
  #reserveCopyFilms = [];

  #sortMenuComponent = new SortView();
  #buttonShowMoreComponent = new ButtonShowMoreView();
  #filmsSectionComponent = new FilmSectionView();

  #filmPresenter = new Map();
  #currentSortType = SortType.DEFAULT;

  #renderedFilmsAmount = FILMS_AMOUNT_PER_STEP;

  constructor (siteMainElement) {
    this.#siteMainElement = siteMainElement;
  }

  init = (films) => {
    this.#films = [...films];
    this.#reserveCopyFilms = [...films];

    if (films.length > 0) {
      renderElement(this.#siteMainElement, this.#sortMenuComponent);
      this.#sortMenuComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
    }

    renderElement(this.#siteMainElement, this.#filmsSectionComponent);

    this.#renderSectionFilms();
  }

  #renderSectionFilms = () => {
    if (this.#films.length !== 0) {
      this.#buildContainer(FilmsTitle.FULL, false, this.#films);
      this.#buildContainer(FilmsTitle.TOP_RATED, true, this.#films.sort(sortByRating));
      this.#buildContainer(FilmsTitle.MOST_COMMENTED, true, this.#films.sort(sortByAmountComments));
    } else {
      this.#buildEmptyContainer(FilmsTitle.EMPTY, true);
    }
  }

  #buildContainer = (title, isExtra, filmsToRender) => {
    renderElement(this.#filmsSectionComponent, new FilmsContainerView(title, isExtra));
    const filmsListElement = this.#filmsSectionComponent.element.querySelector('.films-list:last-child');
    renderElement(filmsListElement, new FilmsListContainerView());

    if (isExtra) {
      this.#renderListFilms(filmsListElement, filmsToRender.slice(0, FILMS_EXTRA_AMOUNT));
    } else {
      this.#renderListFilms(filmsListElement, filmsToRender.slice(0,
        Math.min(this.#films.length, FILMS_AMOUNT_PER_STEP)));

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
    const filmPresenter = new FilmPresenter(filmsContainerElement, this.#handleFilmChange, this.#handleModeChange);
    filmPresenter.init(film);
    this.#filmPresenter.set(film.id, filmPresenter);
  }

  #handleModeChange = () => {
    this.#filmPresenter.forEach((presenter) => presenter.resetView());
  }

  #handleFilmChange = (updatedFilm) => {
    this.#films = updateItem(this.#films, updatedFilm);
    this.#reserveCopyFilms = updateItem(this.#reserveCopyFilms, updatedFilm);
    this.#filmPresenter.get(updatedFilm.id).init(updatedFilm);
  }

  #clearFilmsList = () => {
    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();
    this.#renderedFilmsAmount = FILMS_AMOUNT_PER_STEP;
    removeComponent(this.#filmsSectionComponent);
  }

  #sortFilms = (sortType) => {
    switch (sortType) {
      case SortType.TO_DATE:
        this.#films.sort(sortByDate);
        break;
      case SortType.TO_RATING:
        this.#films = this.#films.sort(sortByRating);
        break;
      default:
        this.#films = [...this.#reserveCopyFilms];
    }

    this.#currentSortType = sortType;
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortFilms(sortType);
    this.#clearFilmsList();
    renderElement(this.#siteMainElement, this.#filmsSectionComponent);
    this.#renderSectionFilms();
  }

}
