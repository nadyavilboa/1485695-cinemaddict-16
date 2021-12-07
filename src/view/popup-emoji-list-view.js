import { createElement } from '../render.js';

const createPopupEmojiListTemplate = (emojiList, isChecked) => (
  `<div class="film-details__emoji-list">
    ${emojiList.map((emoji) =>
    `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emoji}" value="${emoji}" ${isChecked ? 'checked' : ''}>
    <label class="film-details__emoji-label" for="emoji-${emoji}">
      <img src="./images/emoji/${emoji}.png" width="30" height="30" alt="emoji">
    </label>`).join(' ')}
  </div>`
);

export default class PopupEmojiListView {
  #element = null;
  #emojiList = null;
  #isChecked = null;

  constructor(emojiList, isChecked) {
    this.#emojiList = emojiList;
    this.#isChecked = isChecked;
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createPopupEmojiListTemplate(this.#emojiList, this.#isChecked);
  }

  removeElement() {
    this.#element = null;
  }
}
