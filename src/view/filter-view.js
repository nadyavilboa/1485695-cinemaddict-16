export const createFilterItemTemplate = (filter, isCountVisible) => (
  `<a href="#${filter.name}" class="main-navigation__item ${!isCountVisible ? 'main-navigation__item--active' : ''}">${filter.name} <span class="main-navigation__item-count ${!isCountVisible ? 'visually-hidden' : ''}">${filter.count}</span></a>`
);
