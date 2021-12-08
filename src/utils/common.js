import dayjs from 'dayjs';

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

export const sortByKey = (array, key, typeValueOfKey) => {
  const sortArray = array.slice();

  if (typeValueOfKey === 'valueArray') {
    sortArray.sort((a, b) => b[key].length - a[key].length);
  }
  if (typeValueOfKey === 'value') {
    sortArray.sort((a, b) => b[key] - a[key]);
  }

  return sortArray;
};

export const getObjectKeyValue = (array, key, value) => {
  const result = array.find((obj) => obj[key] === value);
  return result;
};
