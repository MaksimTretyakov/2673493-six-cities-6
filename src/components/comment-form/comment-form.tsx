import { useState, ChangeEvent, FormEvent, Fragment, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { postCommentAction } from '../../store/api-actions';
import { AppDispatch, RootState } from '../../store';

const RATING_STARS = [
  { value: 5, title: 'perfect' },
  { value: 4, title: 'good' },
  { value: 3, title: 'not bad' },
  { value: 2, title: 'badly' },
  { value: 1, title: 'terribly' },
];

const MIN_COMMENT_LENGTH = 50;
const MAX_COMMENT_LENGTH = 300;

type CommentFormProps = {
  offerId: string;
};

function CommentForm({ offerId }: CommentFormProps): JSX.Element {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const dispatch = useDispatch<AppDispatch>();

  const isSubmitting = useSelector(
    (state: RootState) => state.isCommentSubmitting
  );
  const comments = useSelector((state: RootState) => state.comments);

  const isFormValid =
    review.length >= MIN_COMMENT_LENGTH &&
    review.length <= MAX_COMMENT_LENGTH &&
    rating > 0;

  useEffect(() => {
    if (!isSubmitting) {
      setRating(0);
      setReview('');
    }
  }, [comments, isSubmitting]);

  const handleRatingChange = (evt: ChangeEvent<HTMLInputElement>) => {
    setRating(Number(evt.target.value));
  };

  const handleReviewChange = (evt: ChangeEvent<HTMLTextAreaElement>) => {
    setReview(evt.target.value);
  };

  const handleSubmit = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    if (isFormValid) {
      dispatch(
        postCommentAction({
          offerId,
          commentData: { comment: review, rating },
        })
      );
    }
  };

  return (
    <form
      className="reviews__form form"
      action="#"
      method="post"
      onSubmit={handleSubmit}
    >
      <label className="reviews__label form__label" htmlFor="review">
        Your review
      </label>
      <div className="reviews__rating-form form__rating">
        {RATING_STARS.map(({ value, title }) => (
          <Fragment key={value}>
            <input
              className="form__rating-input visually-hidden"
              name="rating"
              value={value}
              id={`${value}-stars`}
              type="radio"
              checked={rating === value}
              onChange={handleRatingChange}
              disabled={isSubmitting}
            />
            <label
              htmlFor={`${value}-stars`}
              className="reviews__rating-label form__rating-label"
              title={title}
            >
              <svg className="form__star-image" width="37" height="33">
                <use xlinkHref="#icon-star"></use>
              </svg>
            </label>
          </Fragment>
        ))}
      </div>
      <textarea
        className="reviews__textarea form__textarea"
        id="review"
        name="review"
        placeholder="Tell how was your stay, what you like and what can be improved"
        value={review}
        onChange={handleReviewChange}
        disabled={isSubmitting}
        maxLength={MAX_COMMENT_LENGTH}
      />
      <div className="reviews__button-wrapper">
        <p className="reviews__help">
          To submit review please make sure to set{' '}
          <span className="reviews__star">rating</span> and describe your stay
          with at least{' '}
          <b className="reviews__text-amount">
            {MIN_COMMENT_LENGTH} characters
          </b>
          .
        </p>
        <button
          className="reviews__submit form__submit button"
          type="submit"
          disabled={!isFormValid || isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </div>
    </form>
  );
}

export default CommentForm;
