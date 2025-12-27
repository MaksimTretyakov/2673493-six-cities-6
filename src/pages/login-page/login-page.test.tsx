import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureMockStore } from '@jedmao/redux-mock-store';
import thunk from 'redux-thunk';
import LoginPage from './login-page';
import { makeFakeStore } from '../../utils/mocks';
import { AuthorizationStatus } from '../../consts';
import { loginAction } from '../../store/api-actions';
import { NameSpace } from '../../store/const';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('Page: LoginPage', () => {
  it('should render correctly', () => {
    const store = mockStore(makeFakeStore());
    render(
      <Provider store={store}>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Sign in/i })
    ).toBeInTheDocument();
  });

  it('should dispatch loginAction on form submit', async () => {
    const store = mockStore(makeFakeStore());
    render(
      <Provider store={store}>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </Provider>
    );

    await userEvent.type(
      screen.getByPlaceholderText(/Email/i),
      'test@test.com'
    );
    await userEvent.type(
      screen.getByPlaceholderText(/Password/i),
      'password123'
    );
    await userEvent.click(screen.getByRole('button', { name: /Sign in/i }));

    const actions = store.getActions();
    expect(
      actions.some((action) => action.type === loginAction.pending.type)
    ).toBe(true);
  });

  it('should redirect to main page if user is already authorized', () => {
    const store = mockStore(
      makeFakeStore({
        [NameSpace.User]: {
          ...makeFakeStore()[NameSpace.User],
          authorizationStatus: AuthorizationStatus.Auth,
        },
      })
    );
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/login']}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<span>Main Page</span>} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Main Page')).toBeInTheDocument();
  });
});
