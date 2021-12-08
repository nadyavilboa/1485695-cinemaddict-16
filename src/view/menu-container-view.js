import AbstractView from './abstract-view.js';

const createMenuContainerTemplate = () => (
  `<nav class="main-navigation">
  </nav>`
);

export default class MenuContainerView extends AbstractView {
  get template() {
    return createMenuContainerTemplate();
  }
}
