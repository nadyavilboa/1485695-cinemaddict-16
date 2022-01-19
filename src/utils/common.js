import dayjs from 'dayjs';
import { TimeValues } from '../const.js';

export const getRandomInteger = (numberLeft, numberRight) => {
  if (numberLeft === numberRight) {
    return numberLeft;
  }
  if (numberLeft > numberRight) {
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

export const addIdObjects = (array) => {
  array.forEach((element, index) => {
    element.id = index;
  });
};

export const getRandomDate = (maxDateGap, dateType) => {
  const dateGap = getRandomInteger(-maxDateGap, 0);
  return dayjs().add(dateGap, dateType).toDate();
};

export const countHourInDuration = (valueInteger) => {
  const countHour = Math.floor(valueInteger / TimeValues.AMOUNT_MINUTES_IN_HOUR);
  if (countHour !== 0) {
    return `${String(countHour)  }h`;
  }
};

export const countMinutesInDuration = (valueInteger) => {
  const countMinutes = valueInteger % TimeValues.AMOUNT_MINUTES_IN_HOUR;
  if (countMinutes !== 0) {
    return `${String(countMinutes)  }m`;
  }
};

export const sortByDate = (firstFilm, secondFilm) => dayjs(secondFilm.release.date).diff(dayjs(firstFilm.release.date));


export const sortByRating = (firstFilm, secondFilm) => secondFilm.totalRating - firstFilm.totalRating;

export const sortByAmountComments = (firstFilm, secondFilm) => secondFilm.comments.length - firstFilm.comments.length;

export const getObjectKeyValue = (array, key, value) => {
  const result = array.find((obj) => obj[key] === value);
  return result;
};

export const isEscapeEvent = (key) => key === 'Escape';

export const isEnterEvent = (key) => key === 'Enter';

export const isControlEvent = (key) => key === 'Control';

export const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1),
  ];
};
