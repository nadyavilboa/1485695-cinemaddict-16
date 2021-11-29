const FilmsStringData = {
  FILMS_NAMES : ['Made for Each Other','Popeye the Sailor Meets Sinbad the Sailor','Sagebrush Trail','Santa Claus Conquers the Martians','The Dance of Life','The Great Flamarion','The Man with the Golden Arm'],
  FILMS_POSTERS : ['made-for-each-other.png','popeye-meets-sinbad.png','sagebrush-trail.jpg','santa-claus-conquers-the-martians.jpg','the-dance-of-life.jpg','the-great-flamarion.jpg','the-man-with-the-golden-arm.jpg'],
  FILMS_GENRE : ['Musical','Western','Drama','Comedy','Cartoon','Mystery'],
  FILMS_DESCRIPTIONS : ['Lorem ipsum dolor sit amet, consectetur adipiscing elit.','Cras aliquet varius magna, non porta ligula feugiat eget.','Fusce tristique felis at fermentum pharetra.','Aliquam id orci ut lectus varius viverra.','Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.','Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.','Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.','Sed sed nisi sed augue convallis suscipit in sed felis.','Aliquam erat volutpat.','Nunc fermentum tortor ac porta dapibus.','In rutrum ac purus sit amet tempus.'],
};

const FilmsNumberData = {
  MIN_RATING: 10,
  MAX_RATING: 100,
  RATING_MULTIPLER: 0.1,
  MIN_YEAR: 1920,
  MAX_YEAR: 1990,
  MIN_LENGTH_DESCRIPTION: 1,
  MAX_LENGTH_DESCRIPTION: 5,
  MIN_DURATION: 10,
  MAX_DURATION: 240,
  MAX_COMMENT_COUNT: 5,
};

const getRandomInteger = (numberLeft, numberRight) => {
  if(numberLeft < 0 || numberRight < 0) {
    return null;
  }
  if(numberLeft === numberRight) {
    return numberLeft;
  }
  if(numberLeft > numberRight) {
    getRandomInteger(numberRight, numberLeft);
  }
  const randResult = numberLeft + Math.random() * (numberRight + 1 - numberLeft);
  return Math.floor(randResult);
};

const getUrlPoster = () => {
  const numberFilm = getRandomInteger(1,FilmsStringData.FILMS_NAMES.length) -1;
  return `./images/posters/${FilmsStringData.FILMS_POSTERS[numberFilm]}`;
};

const getRating = () => {
  const rating  = getRandomInteger(FilmsNumberData.MIN_RATING, FilmsNumberData.MAX_RATING);
  return (rating * FilmsNumberData.RATING_MULTIPLER).toFixed(1);
};

const generateDescription = () => {
  let description = '';
  const length = getRandomInteger(FilmsNumberData.MIN_LENGTH_DESCRIPTION, FilmsNumberData.MAX_LENGTH_DESCRIPTION);
  let count = 0;
  while (count < length) {
    const number = getRandomInteger(1,FilmsStringData.FILMS_DESCRIPTIONS.length) - 1;
    description = description + FilmsStringData.FILMS_DESCRIPTIONS[number];
    count++;
  }
  return description;
};

const generateDuration = () => {
  const duration = getRandomInteger(FilmsNumberData.MIN_DURATION,FilmsNumberData.MAX_DURATION);
  const hour = Math.floor(duration / 60);
  const minutes = duration % 60;
  return hour === 0 ? `${minutes}m` : `${hour}h ${minutes}m`;
};

export const generateFilm = () => ({
  poster: getUrlPoster(),
  name: FilmsStringData.FILMS_NAMES[getRandomInteger(1,FilmsStringData.FILMS_NAMES.length) -1],
  rating: getRating(),
  year: getRandomInteger(FilmsNumberData.MIN_YEAR,FilmsNumberData.MAX_YEAR),
  duration: generateDuration(),
  genre: FilmsStringData.FILMS_GENRE[getRandomInteger(1,FilmsStringData.FILMS_NAMES.length) -1],
  description: generateDescription(),
  countComments: getRandomInteger(0,FilmsNumberData.MAX_COMMENT_COUNT),
});
