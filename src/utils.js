import dayjs from 'dayjs';

const UserRankNames = {
  LOW: 'Novice',
  MIDDLE: 'Fan',
  HIGH: 'Movie Buff',
};

const UserRankLevels = {
  LOW: 10,
  HIGH: 20,
};

export const getRandomInteger = (numberLeft, numberRight) => {
  if(numberLeft === numberRight) {
    return numberLeft;
  }
  if(numberLeft > numberRight) {
    getRandomInteger(numberRight, numberLeft);
  }
  const randResult = numberLeft + Math.random() * (numberRight + 1 - numberLeft);
  return Math.floor(randResult);
};

export const getRandomElements = (array, numberLeft = 1, numberRight = array.length) => {
  const randomArray = [];
  let number = Math.abs(getRandomInteger(numberLeft, numberRight) - 1);
  let length = Math.abs(getRandomInteger(numberLeft, numberRight));
  if (number > length) {
    const swapper = number;
    number = length;
    length = swapper;
  }
  if (number === length) {
    length++;
  }
  for (let i = number; i < length; i++) {
    randomArray.push(array[i]);
  }
  return randomArray;
};

export const getActualRank = (watched) => {
  let rank;

  if (watched > 0 && watched <= UserRankLevels.LOW) {
    rank = UserRankNames.LOW;
  }

  if (watched > UserRankLevels.LOW && watched <= UserRankLevels.HIGH) {
    rank = UserRankNames.MIDDLE;
  }

  if (watched > UserRankLevels.HIGH) {
    rank = UserRankNames.HIGH;
  }

  return rank;
};

export const addIdObjects = (array) => {
  array.forEach((element, index) => {
    element.id = index;
  });
};

export const generateCommentsFilm = (comments) => {
  const commentsFilm = [];
  getRandomElements(comments, 0, 5).forEach((element) => {
    if (element) {
      commentsFilm.push(element.id);
    }
  });
  return commentsFilm;
};

export const getUrlImage = (folder, namesFiles) => {
  const numberFilm = getRandomInteger(1, namesFiles.length) - 1;
  return `${folder}${namesFiles[numberFilm]}`;
};

export const getRandomDate = (maxDateGap, dateType) => {
  const dateGap = getRandomInteger(-maxDateGap, 0);
  return dayjs().add(dateGap, dateType).toDate();
};

const isFilmInWatchlist = (film) => Boolean(film.userDetails.watchlist);

const isFilmWatched = (film) => Boolean(film.userDetails.alreadyWatched);

const isFilmFavorite = (film) => Boolean(film.userDetails.favorite);

const initialFilters = {
  watchlist: 0,
  history: 0,
  favorites: 0,
};

export const generateFilters = (films) => films.reduce((acc, currentFilm) => {
  if (isFilmInWatchlist(currentFilm)) {
    acc.watchlist++;
  }

  if (isFilmWatched(currentFilm)) {
    acc.history++;
  }

  if (isFilmFavorite(currentFilm)) {
    acc.favorites++;
  }

  return acc;
}, initialFilters);

export const isEscapeEvent = (evt) => evt.key === 'Escape' || evt.key === 'Esc';
