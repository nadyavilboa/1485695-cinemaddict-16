export const createPopupCommentsContainerTemplate = (commentCount) => (
  `<div class="film-details__bottom-container">
    <section class="film-details__comments-wrap">
      <h3 class="film-details__comments-title">Comments
        <span class="film-details__comments-count">${commentCount}</span>
      </h3>

    </section>
</div>`
);
