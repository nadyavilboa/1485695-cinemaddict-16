export const TimeValues = {
  AMOUNT_MINUTES_IN_HOUR: 60,
  AMOUNT_DAYS_IN_WEEK: 7,
  AMOUNT_DAYS_IN_MONTH: 30,
  AMOUNT_DAYS_IN_YEAR: 360,
  AMOUNT_YEARS_PROGRAM: 30,
};

export const FilmsTitle = {
  EMPTY: 'There are no movies in our database',
  FULL: 'All movies. Upcoming',
  TOP_RATED: 'Top rated',
  MOST_COMMENTED: 'Most commented',
};

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

//выбран фильтр - MINOR_BIG_LIST - перерисовка основного списка
//изменены контролы - MAJOR - перерисовка трёх списков и фильтров
//добавлен/удален коммент - MINOR_ALL_LISTS - перерисовка трёх списков

export const MenuItem = {
  STATS: 'stats',
  ALL_MOVIES: 'allMovies',
  WATCHLIST: 'watchlist',
  HISTORY: 'history',
  FAVORITES: 'favorites',
};

export const StatisticsPeriods = [
  {
    value: 'all-time',
    text: 'All time',
  },
  {
    value: 'today',
    text: 'Today',
  },
  {
    value: 'week',
    text: 'Week',
  },
  {
    value: 'month',
    text: 'Month',
  },
  {
    value: 'year',
    text: 'Year',
  },
];

export const Color = {
  YELLOW: 'yellow',
  WHITE: 'white',
};
