import { render, screen } from '@testing-library/react';
import ReviewItem from './review-item';
import { makeFakeReview } from '../../utils/mocks';

describe('Component: ReviewItem', () => {
  it('should render correctly', () => {
    const mockReview = makeFakeReview();
    render(<ReviewItem review={mockReview} />);

    expect(screen.getByText(mockReview.user.name)).toBeInTheDocument();
    expect(screen.getByText(mockReview.comment)).toBeInTheDocument();
    expect(screen.getByAltText('Reviews avatar')).toBeInTheDocument();
  });
});
