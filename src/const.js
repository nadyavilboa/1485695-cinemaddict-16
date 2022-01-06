export const SortType = {
  DEFAULT: 'default',
  TO_DATE: 'to-date',
  TO_RATING: 'to-rating',
};

export const ControlType = {
  WATCHLIST: 'watchlist',
  ALREADY_WATCHED: 'watched',
  FAVORITE: 'favorite',
};

export const COMMENTS_EMOTION = ['smile', 'sleeping', 'puke', 'angry'];

export const UserAction = {
  CHANGE_CONTROLS: 'CNANGE_CONTROLS',
  ADD_COMMENT: 'ADD_COMMENT',
  DELETE_COMMENT: 'DELETE_COMMENT',
};

export const UpdateType = {
  MINOR_BIG_LIST: 'MINOR_BIG_LIST',
  MINOR_ALL_LISTS: 'MINOR_ALL_LISTS',
  MAJOR: 'MAJOR',
};

//выбран фильтр - перерисовка основного списка
//изменены контролы - перерисовка трёх списков и фильтров
//добавлен/удален коммент - перерисовка трёх списков
