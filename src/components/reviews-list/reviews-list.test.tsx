import { render, screen } from '@testing-library/react';
import ReviewsList from './reviews-list';
import { makeFakeReview } from '../../utils/mocks';

describe('Component: ReviewsList', () => {
  it('should render a list of reviews', () => {
    const mockReviews = [makeFakeReview(), makeFakeReview()];
    render(<ReviewsList reviews={mockReviews} />);

    const heading = screen.getByRole('heading', { name: /Reviews/i });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent(`Reviews · ${mockReviews.length}`);
    expect(screen.getAllByRole('listitem')).toHaveLength(mockReviews.length);
  });
});
