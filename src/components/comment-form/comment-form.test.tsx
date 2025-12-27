import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureMockStore } from '@jedmao/redux-mock-store';
import thunk from 'redux-thunk';
import CommentForm from './comment-form';
import { makeFakeStore } from '../../utils/mocks';
import { NameSpace } from '../../store/const';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
const store = mockStore(makeFakeStore());

describe('Component: CommentForm', () => {
  it('should render correctly', () => {
    render(
      <Provider store={store}>
        <CommentForm offerId="1" />
      </Provider>
    );

    expect(screen.getByLabelText(/Your review/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Submit/i })).toBeInTheDocument();
  });

  it('should enable submit button when form is valid', async () => {
    render(
      <Provider store={store}>
        <CommentForm offerId="1" />
      </Provider>
    );

    const submitButton = screen.getByRole('button', { name: /Submit/i });
    expect(submitButton).toBeDisabled();

    await userEvent.click(screen.getByTitle('perfect'));
    await userEvent.type(
      screen.getByPlaceholderText(/Tell how was your stay/i),
      'This is a valid comment with more than fifty characters.'
    );

    expect(submitButton).toBeEnabled();
  });

  it('should disable submit button when comment is too short', async () => {
    render(
      <Provider store={store}>
        <CommentForm offerId="1" />
      </Provider>
    );

    const submitButton = screen.getByRole('button', { name: /Submit/i });
    await userEvent.click(screen.getByTitle('perfect'));
    await userEvent.type(
      screen.getByPlaceholderText(/Tell how was your stay/i),
      'short'
    );
    expect(submitButton).toBeDisabled();
  });

  it('should disable form while submitting', () => {
    const submittingStore = mockStore(
      makeFakeStore({
        [NameSpace.Data]: {
          ...makeFakeStore()[NameSpace.Data],
          isCommentSubmitting: true,
        },
      })
    );
    render(
      <Provider store={submittingStore}>
        <CommentForm offerId="1" />
      </Provider>
    );
    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByRole('textbox')).toBeDisabled();
  });
});
