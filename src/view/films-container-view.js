export const createFilmsContainerTemplate = () => (
  `<section class="films">
    <section class="films-list" id="full-list">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>

      <div class="films-list__container"></div>

    </section>
    <section class="films-list films-list--extra" id="top-rated">
      <h2 class="films-list__title">Top rated</h2>
      <div class="films-list__container"></div>

    </section>
    <section class="films-list films-list--extra" id="most-commented">
      <h2 class="films-list__title">Most commented</h2>
      <div class="films-list__container"></div>

    </section>
  </section>`
);
