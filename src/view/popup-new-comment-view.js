import SmartView from './smart-view.js';
import { COMMENTS_EMOTION } from '../const.js';

const BLANK_COMMENT = {
  text: '',
  emotion: 'smile',
};

const createPopupEmotionListTemplate = (emotionList, activeEmotion) => (
  `<div class="film-details__emoji-list">
    ${emotionList.map((emotion) => (
    `<input
      class="film-details__emoji-item visually-hidden"
      name="comment-emoji"
      type="radio"
      id="emoji-${emotion}"
      value="${emotion}"
      ${emotion === activeEmotion ? 'checked' : ''}
    >
    <label
      class="film-details__emoji-label"
      for="emoji-${emotion}"
    >
      <img
        src="./images/emoji/${emotion}.png"
        width="30"
        height="30"
        alt="emoji"
      />
    </label>`)).join('')}
  </div>`
);

const createPopupNewCommentTemplate = ({emotion, text}) => {
  const popupEmotionListTemplate = createPopupEmotionListTemplate(COMMENTS_EMOTION, emotion);

  return (
    `<div class="film-details__new-comment">
      <div class="film-details__add-emoji-label">
        <img
          src="images/emoji/${emotion}.png"
          width="55"
          height="55"
          alt="emoji-${emotion}"
        />
      </div>
      <label class="film-details__comment-label">
        <textarea
          class="film-details__comment-input"
          placeholder="Select reaction below and write comment here" name="comment"
        >${text}</textarea>
      </label>
      ${popupEmotionListTemplate}
    </div>`);
};

export default class PopupNewCommentView extends SmartView {

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
      .addEventListener('input', this.#textCommentInputHandler);

    const inputsEmotion = this.element.querySelectorAll('.film-details__emoji-item');
    inputsEmotion.forEach((inputEmotion) => (
      inputEmotion.addEventListener('click', this.#inputEmotionClickHandler))
    );
  }

  #textCommentInputHandler = (evt) => {
    evt.preventDefault();
    this._data = {...this._data, text: evt.target.value};
    this.updateData(this._data, true);
  }

  #inputEmotionClickHandler = (evt) => {
    evt.preventDefault();
    this._data = {...this._data, emotion: evt.target.value};
    this.updateData(this._data);
  }

  static parseCommentToData = (newComment) => ({...newComment});
}
