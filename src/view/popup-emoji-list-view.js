import AbstractView from './abstract-view.js';

const createPopupEmojiListTemplate = (emojiList, isChecked) => (
  `<div class="film-details__emoji-list">
    ${emojiList.map((emoji) =>
    `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emoji}" value="${emoji}" ${isChecked ? 'checked' : ''}>
    <label class="film-details__emoji-label" for="emoji-${emoji}">
      <img src="./images/emoji/${emoji}.png" width="30" height="30" alt="emoji">
    </label>`).join(' ')}
  </div>`
);

export default class PopupEmojiListView extends AbstractView {
  #emojiList = null;
  #isChecked = null;

  constructor(emojiList, isChecked) {
    super();
    this.#emojiList = emojiList;
    this.#isChecked = isChecked;
  }

  get template() {
    return createPopupEmojiListTemplate(this.#emojiList, this.#isChecked);
  }
}
