import { makeFakeReview, makeFakeStore } from '../utils/mocks';
import { selectSortedComments } from './selectors';
import { NameSpace } from './const';

describe('Selectors', () => {
  describe('selectSortedComments', () => {
    it('should return comments sorted by date descending (newest first)', () => {
      const review1 = makeFakeReview({ date: '2023-01-01T12:00:00.000Z' });
      const review2 = makeFakeReview({ date: '2023-03-15T12:00:00.000Z' });
      const review3 = makeFakeReview({ date: '2023-02-10T12:00:00.000Z' });
      const unsortedReviews = [review1, review2, review3];

      const state = makeFakeStore({
        [NameSpace.Data]: {
          ...makeFakeStore()[NameSpace.Data],
          comments: unsortedReviews,
        },
      });

      const sortedComments = selectSortedComments(state);

      expect(sortedComments).toEqual([review2, review3, review1]);
    });

    it('should return an empty array if there are no comments', () => {
      const state = makeFakeStore({
        [NameSpace.Data]: {
          ...makeFakeStore()[NameSpace.Data],
          comments: [],
        },
      });

      const sortedComments = selectSortedComments(state);
      expect(sortedComments).toEqual([]);
    });
  });
});
