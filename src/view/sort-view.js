import AbstractView from './abstract-view.js';
import { SortType } from '../const.js';

const createSortTemplate = (currentSortType) => (
  `<ul class="sort">
    <li>
      <a
        href="#"
        class="sort__button ${currentSortType === SortType.DEFAULT ? 'sort__button--active' : ''}"
        data-sort-type="${SortType.DEFAULT}"
      >
        Sort by default
      </a>
    </li>
    <li>
      <a
        href="#"
        class="sort__button ${currentSortType === SortType.TO_DATE ? 'sort__button--active' : ''}"
        data-sort-type="${SortType.TO_DATE}"
      >
        Sort by date
      </a>
    </li>
    <li>
      <a
        href="#"
        class="sort__button ${currentSortType === SortType.TO_RATING ? 'sort__button--active' : ''}"
        data-sort-type="${SortType.TO_RATING}"
      >
        Sort by rating
      </a>
    </li>
  </ul>`
);

export default class SortView extends AbstractView {
  #currentSortType = null;

  constructor(currentSortType) {
    super();
    this.#currentSortType = currentSortType;
  }

  get template() {
    return createSortTemplate(this.#currentSortType);
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
  }
}
