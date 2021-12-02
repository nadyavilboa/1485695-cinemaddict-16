export const createFilterItemTemplate = (filter) => (
  `<a href="#${filter.name}" class="main-navigation__item">${filter.name} <span class="main-navigation__item-count">${filter.count}</span></a>`
);
