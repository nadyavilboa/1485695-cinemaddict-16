import AbstractView from './abstract-view.js';

const createPopupCloseButtonTemplate = () => (
  `<div class="film-details__close">
    <button class="film-details__close-btn" type="button">
      close
    </button>
  </div>`
);

export default class PopupCloseButtonView extends AbstractView {
  get template() {
    return createPopupCloseButtonTemplate();
  }
}
