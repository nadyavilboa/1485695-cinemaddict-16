import { getRandomInteger,getRandomDate } from './../utils';

export const CommentsStringData = {
  COMMENTS_TEXT : ['Interesting setting and a good cast', 'Booooooooooring', 'Very very old. Meh', 'Almost two hours? Seriously?', 'Interesting story'],
  COMMENTS_AUTHOR: ['Tim Macoveev', 'John Doe', 'Oliver Johnson', 'Lily King'],
  COMMENTS_EMOTION: ['smile', 'sleeping', 'puke', 'angry'],
};

const MAX_DAY_GAP = 30;

export const generateComment = () => ({
  id: 0,
  author: CommentsStringData.COMMENTS_AUTHOR[getRandomInteger(1,CommentsStringData.COMMENTS_AUTHOR.length) - 1],
  comment: CommentsStringData.COMMENTS_TEXT[getRandomInteger(1,CommentsStringData.COMMENTS_TEXT.length) - 1],
  date: getRandomDate(MAX_DAY_GAP, 'day') ,
  emotion: CommentsStringData.COMMENTS_EMOTION[getRandomInteger(1,CommentsStringData.COMMENTS_EMOTION.length) - 1],
});
