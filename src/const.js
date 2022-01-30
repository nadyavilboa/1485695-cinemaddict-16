export const ApiParameters = {
  AUTHORIZATION: 'Basic 21mflsldsr345kl',
  END_POINT: 'https://16.ecmascript.pages.academy/cinemaddict',
};

export const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

export const RenderPosition = {
  BEFORE_BEGIN: 'beforebegin',
  AFTER_BEGIN: 'afterbegin',
  BEFORE_END: 'beforeend',
  AFTER_END: 'afterend',
};

export const FILMS_AMOUNT_PER_STEP = 5;
export const FILMS_EXTRA_AMOUNT = 2;

export const BLANK_COMMENT = {
  text: '',
  emotion: 'smile',
};

export const TimeValues = {
  AMOUNT_MINUTES_IN_HOUR: 60,
  AMOUNT_DAYS_IN_WEEK: 7,
  AMOUNT_DAYS_IN_MONTH: 30,
  AMOUNT_DAYS_IN_YEAR: 360,
  AMOUNT_YEARS_PROGRAM: 30,
};

export const FilmsTitle = {
  EMPTY_FULL: 'There are no movies in our database',
  EMPTY_WATCHLIST: 'There are no movies to watch now',
  EMPTY_HISTORY: 'There are no watched movies now',
  EMPTY_FAVORITES: 'There are no favorite movies now',
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
  PATH: 'PATH',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

export const MenuItem = {
  STATS: 'stats',
  ALL: 'all',
  WATCHLIST: 'watchlist',
  HISTORY: 'history',
  FAVORITES: 'favorites',
};

export const submitKeys = ['Control', 'Enter'];

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

export const BAR_HEIGHT = 50;

export const UserRankNames = {
  LOW: 'Novice',
  MIDDLE: 'Fan',
  HIGH: 'Movie Buff',
};

export const UserRankLevels = {
  LOW: 10,
  HIGH: 20,
};
