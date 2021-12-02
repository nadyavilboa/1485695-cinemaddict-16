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

export const getRandomElements = (array) => {
  const randomArray = [];
  const length = getRandomInteger(1, array.length);
  let count = 0;
  while (count < length) {
    const number = getRandomInteger(1, array.length) - 1;
    randomArray.push(array[number]);
    count++;
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

export const getUrlImage = (folder, namesFiles) => {
  const numberFilm = getRandomInteger(1, namesFiles.length) - 1;
  return `${folder}${namesFiles[numberFilm]}`;
};

export const getRandomDate = (maxDateGap, dateType) => {
  const dateGap = getRandomInteger(-maxDateGap, 0);
  return dayjs().add(dateGap, dateType).toDate();
};

//console.log(dayjs().format('YYYY/MM/DD HH:mm'));
//console.log(dayjs().format('D MMMM YYYY'));
//console.log(dayjs().format('H:mm'));

export const isFilmInWatchlist = (film) => Boolean(film.userDetails.watchlist);

export const isFilmWatched = (film) => Boolean(film.userDetails.alreadyWatched);

export const isFilmFavorite = (film) => Boolean(film.userDetails.favorite);
