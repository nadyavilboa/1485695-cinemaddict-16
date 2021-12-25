import { nanoid } from 'nanoid';
import { getRandomInteger, getRandomElements, getRandomDate } from './../utils/common.js';
import { getUrlImage, generateCommentsFilm } from '../utils/film.js';
import { comments } from './comments.js';

const FilmsStringData = {
  FILMS_TITLES : ['Made for Each Other', 'Popeye the Sailor Meets Sinbad the Sailor', 'Sagebrush Trail', 'Santa Claus Conquers the Martians', 'The Dance of Life', 'The Great Flamarion', 'The Man with the Golden Arm'],
  FILMS_ALTERNATIVE_TITLES: ['The Great Flamarion', 'Made for Each Other', 'Popeye the Sailor Meets Sinbad the Sailor', 'Sagebrush Trail', 'Santa Claus Conquers the Martians', 'The Dance of Life', 'The Great Flamarion'],
  FILMS_POSTERS : ['made-for-each-other.png', 'popeye-meets-sinbad.png', 'sagebrush-trail.jpg', 'santa-claus-conquers-the-martians.jpg', 'the-dance-of-life.jpg', 'the-great-flamarion.jpg', 'the-man-with-the-golden-arm.jpg'],
  FILMS_POSTERS_FOLDER: './images/posters/',
  FILMS_GENRE : ['Musical', 'Western', 'Drama', 'Comedy', 'Cartoon', 'Mystery'],
  FILMS_DIRECTORS: ['Anthony Mann', 'Tom Ford', 'Steven Spielberg', 'Alfred Hitchcock'],
  FILMS_WRITERS: ['Takeshi Kitano', 'Anne Wigton', 'Heinz Herald', 'Richard Weil'],
  FILMS_ACTORS: ['Morgan Freeman', 'Erich von Stroheim', 'Mary Beth Hughes', 'Dan Duryea'],
  FILMS_COUNTRY: ['USA', 'Germany', 'France', 'Italy'],
  FILMS_DESCRIPTIONS : ['Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 'Cras aliquet varius magna, non porta ligula feugiat eget.',
    'Fusce tristique felis at fermentum pharetra.', 'Aliquam id orci ut lectus varius viverra.', 'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
    'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.', 'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
    'Sed sed nisi sed augue convallis suscipit in sed felis.', 'Aliquam erat volutpat.', 'Nunc fermentum tortor ac porta dapibus.', 'In rutrum ac purus sit amet tempus.'],
};

const FilmsNumberData = {
  MIN_RATING: 10,
  MAX_RATING: 100,
  RATING_MULTIPLER: 0.1,
  MAX_AGE_RATING: 18,
  MAX_DAY_GAP: 100,
  MIN_LENGTH_DESCRIPTION: 1,
  MAX_LENGTH_DESCRIPTION: 5,
  MIN_RUNTIME: 10,
  MAX_RUNTIME: 240,
};

const getRating = () => {
  const rating  = getRandomInteger(FilmsNumberData.MIN_RATING, FilmsNumberData.MAX_RATING);
  return (rating * FilmsNumberData.RATING_MULTIPLER).toFixed(1);
};

export const generateFilm = () => ({
  id: nanoid(),
  comments: generateCommentsFilm(comments),
  poster: getUrlImage(FilmsStringData.FILMS_POSTERS_FOLDER, FilmsStringData.FILMS_POSTERS),
  title: FilmsStringData.FILMS_TITLES[getRandomInteger(1, FilmsStringData.FILMS_TITLES.length) - 1],
  alternativeTitle: FilmsStringData.FILMS_ALTERNATIVE_TITLES[getRandomInteger(1, FilmsStringData.FILMS_ALTERNATIVE_TITLES.length) - 1],
  totalRating: getRating(),
  ageRating: getRandomInteger(0, FilmsNumberData.MAX_AGE_RATING),
  director: FilmsStringData.FILMS_DIRECTORS[getRandomInteger(1, FilmsStringData.FILMS_DIRECTORS.length) - 1],
  release: {
    date: getRandomDate(FilmsNumberData.MAX_DAY_GAP, 'year'),
    releaseCountry: FilmsStringData.FILMS_COUNTRY[getRandomInteger(1, FilmsStringData.FILMS_COUNTRY.length) - 1],
  },
  runtime: getRandomInteger(FilmsNumberData.MIN_RUNTIME, FilmsNumberData.MAX_RUNTIME),
  writers: getRandomElements(FilmsStringData.FILMS_WRITERS),
  actors: getRandomElements(FilmsStringData.FILMS_ACTORS),
  genres: getRandomElements(FilmsStringData.FILMS_GENRE),
  description: getRandomElements(FilmsStringData.FILMS_DESCRIPTIONS).join(''),
  userDetails: {
    watchList: Boolean(getRandomInteger(0, 1)),
    alreadyWatched: Boolean(getRandomInteger(0, 1)),
    watchingDate: getRandomDate(FilmsNumberData.MAX_DAY_GAP, 'day'),
    favorite: Boolean(getRandomInteger(0, 1)),
  },
});

