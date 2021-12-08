import AbstractView from './abstract-view.js';

const createHeaderLogoTemplate = () => (
  `<h1 class="header__logo logo">
    Cinemaddict
  </h1>`
);

export default class HeaderLogoView extends AbstractView {
  get template() {
    return createHeaderLogoTemplate();
  }
}
