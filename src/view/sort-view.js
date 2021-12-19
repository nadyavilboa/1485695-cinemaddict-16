import AbstractView from './abstract-view.js';
import { createElement } from '../utils/render.js';

export const SortType = {
  DEFAULT: 'default',
  TO_DATE: 'to-date',
  TO_RATING: 'to-rating',
};

const createSortTemplate = () => (
  `<ul class="sort">
    <li>
      <a href="#" class="sort__button sort__button--active" data-sort-type="${SortType.DEFAULT}">
        Sort by default
      </a>
    </li>
    <li>
      <a href="#" class="sort__button" data-sort-type="${SortType.TO_DATE}">
        Sort by date
      </a>
    </li>
    <li>
      <a href="#" class="sort__button" data-sort-type="${SortType.TO_RATING}">
        Sort by rating
      </a>
    </li>
  </ul>`
);

export default class SortView extends AbstractView {
  #element = null;

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    this.sortButtons = this.#element.querySelectorAll('.sort__button');

    return this.#element;
  }

  get template() {
    return createSortTemplate();
  }

  setSortTypeChangeHandler = (callback) => {
    this._callback.sortTypeChange = callback;
    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  }

  #sortTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'A') {
      return;
    }

    evt.preventDefault();
    this._callback.sortTypeChange(evt.target.dataset.sortType);

    this.sortButtons.forEach(
      (button) => button.classList.remove('sort__button--active'));
    evt.target.classList.add('sort__button--active');
  }
}
