import FilmSectionView from '../view/film-section-view.js';
import FilmsContainerView from '../view/films-container-view.js';
import FilmsListContainerView from '../view/films-list-container-view.js';
import ButtonShowMoreView from '../view/button-show-more-view.js';
import FilmPresenter from './film-presenter.js';
import { sortByKey, updateItem } from '../utils/common.js';
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
  #filmsSectionComponent = null;
  #films = null;

  #buttonShowMoreComponent = new ButtonShowMoreView();

  #filmPresenter = new Map();

  constructor (siteMainElement) {
    this.#siteMainElement = siteMainElement;
  }

  init = (films) => {
    this.#films = films;

    this.#filmsSectionComponent = new FilmSectionView();
    renderElement(this.#siteMainElement, this.#filmsSectionComponent);

    this.#renderSectionFilms();
  }

  #renderSectionFilms = () => {
    if (this.#films.length !== 0) {
      this.#buildContainer(FilmsTitle.FULL, false, this.#films);
      this.#buildContainer(FilmsTitle.TOP_RATED, true, sortByKey(this.#films, 'totalRating', 'value'));
      this.#buildContainer(FilmsTitle.MOST_COMMENTED, true, sortByKey(this.#films, 'comments', 'valueArray'));
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
      this.#renderListFilms(filmsListElement, filmsToRender.slice(0, Math.min(this.#films.length, FILMS_AMOUNT_PER_STEP)));

      this.#renderButtonShowMore(filmsListElement, filmsToRender);
    }
  }

  #renderButtonShowMore = (filmsListElement, filmsToRender) => {
    if (filmsToRender.length > FILMS_AMOUNT_PER_STEP) {
      let renderedFilmsAmount = FILMS_AMOUNT_PER_STEP;

      renderElement(filmsListElement, this.#buttonShowMoreComponent);

      this.#buttonShowMoreComponent.setClickHandler(() => {
        this.#showMoreFilms(filmsToRender
          .slice(renderedFilmsAmount, renderedFilmsAmount + FILMS_AMOUNT_PER_STEP));

        renderedFilmsAmount += FILMS_AMOUNT_PER_STEP;

        if (renderedFilmsAmount >= filmsToRender.length) {
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
    const filmPresenter = new FilmPresenter(filmsContainerElement, this.#handleFilmChange);
    filmPresenter.init(film);
    this.#filmPresenter.set(film.id, filmPresenter);
  }

  #handleFilmChange = (updatedFilm) => {
    this.#films = updateItem(this.#films, updatedFilm);
    this.#filmPresenter.get(updatedFilm.id).init(updatedFilm);
  }

}
