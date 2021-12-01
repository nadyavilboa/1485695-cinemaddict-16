export const createFooterTemplate = (filmsCount) => (
  `<section class="footer__logo logo logo--smaller">Cinemaddict</section>
  <section class="footer__statistics">
    <p>
      ${filmsCount} movies inside
    </p>
  </section>`
);
