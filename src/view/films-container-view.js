import AbstractView from './abstract-view.js';

const createFilmsContainerTemplate = (title, isExtra = true) => (
  `<section class="films-list ${isExtra ? 'films-list--extra' : ''}">
    <h2 class="films-list__title ${!isExtra ? 'visually-hidden' : ''}">
      ${title}
    </h2>
  </section>`
);

export default class FilmsContainerView extends AbstractView {
  #title = null;
  #isExtra = true;

  constructor(title, isExtra) {
    super();
    this.#title = title;
    this.#isExtra = isExtra;
  }

  get template() {
    return createFilmsContainerTemplate(this.#title, this.#isExtra);
  }
}
