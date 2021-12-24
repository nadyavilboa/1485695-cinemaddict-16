import SmartView from './smart-view.js';
import { CommentsStringData } from '../mock/comments.js';

const BLANK_COMMENT = {
  text: 'Great movie!',
  emoji: 'smile',
};

const createPopupEmojiListTemplate = (emojiList, isChecked) => (
  `<div class="film-details__emoji-list">
    ${emojiList.map((emoji) =>
    `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emoji}" value="${emoji}" ${isChecked ? 'checked' : ''}>
    <label class="film-details__emoji-label" for="emoji-${emoji}">
      <img src="./images/emoji/${emoji}.png" width="30" height="30" alt="emoji">
    </label>`).join(' ')}
  </div>`
);

const createPopupNewCommentTemplate = (newComment) => {
  const popupEmojiListTemplate = createPopupEmojiListTemplate(CommentsStringData.COMMENTS_EMOTION, false);

  return (
    `<div class="film-details__new-comment">
      <div class="film-details__add-emoji-label">
        <img src="images/emoji/${newComment.emoji}.png" width="55" height="55" alt="emoji-${newComment.emoji}">
      </div>
      <label class="film-details__comment-label">
        <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${newComment.text}</textarea>
      </label>
      ${popupEmojiListTemplate}
    </div>`);
};

export default class PopupNewCommentView extends SmartView {
  #element = null;

  constructor(newComment = BLANK_COMMENT) {
    super();

    this._data = PopupNewCommentView.parseCommentToData(newComment);

    this.#setInnerHandlers();
  }

  get template() {
    return createPopupNewCommentTemplate(this._data);
  }

  restoreHandlers = () => {
    this.#setInnerHandlers();
  }

  #setInnerHandlers = () => {
    this.element.querySelector('.film-details__comment-input')
      .addEventListener('click', this.#textCommentInputHandler);

    const inputsEmoji = this.element.querySelectorAll('.film-details__emoji-item');
    inputsEmoji.forEach((inputEmoji) =>
      inputEmoji.addEventListener('click', this.#inputEmojiClickHandler));
  }

  #textCommentInputHandler = (evt) => {
    evt.preventDefault();
    this.updateData({text: evt.target.value}, true);
    PopupNewCommentView.parseDataToComment(this._data);
  }

  #inputEmojiClickHandler = (evt) => {
    evt.preventDefault();
    this.updateData({emoji: evt.target.value});
    PopupNewCommentView.parseDataToControls(this._data);
  }

  static parseCommentToData = (newComment) => ({...newComment});

  static parseDataToControls = (data) => {
    const newComment = {...data};

    return newComment;
  };
}
