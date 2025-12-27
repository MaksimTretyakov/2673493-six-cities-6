import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import NotFoundPage from './not-found-page';
import { Provider } from 'react-redux';
import { configureMockStore } from '@jedmao/redux-mock-store';
import { makeFakeStore } from '../../utils/mocks';

const mockStore = configureMockStore();
const store = mockStore(makeFakeStore());

describe('Component: NotFoundPage', () => {
  it('should render correctly', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <NotFoundPage />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('404 Not Found')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /Go to the main page/i })
    ).toBeInTheDocument();
  });
});
