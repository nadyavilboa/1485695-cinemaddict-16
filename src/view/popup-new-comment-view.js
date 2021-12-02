export const createPopupNewCommentTemplate = () => (
  `<div class="film-details__new-comment">
      <div class="film-details__add-emoji-label">
        <img src="images/emoji/smile.png" width="55" height="55" alt="emoji-smile">
      </div>

      <label class="film-details__comment-label">
        <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">Great movie!</textarea>
      </label>
  </div>`
);
