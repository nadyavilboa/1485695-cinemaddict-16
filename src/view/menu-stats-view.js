import AbstractView from './abstract-view.js';

const createMenuStatsTemplate = () => (
  `<a href="#stats" class="main-navigation__additional">
    Stats
  </a>`
);

export default class MenuStatsView extends AbstractView {
  get template() {
    return createMenuStatsTemplate();
  }
}
