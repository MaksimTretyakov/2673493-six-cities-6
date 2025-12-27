import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureMockStore } from '@jedmao/redux-mock-store';
import thunk from 'redux-thunk';
import LoginPage from './login-page';
import { makeFakeStore } from '../../utils/mocks';
import { AuthorizationStatus, CITIES } from '../../consts';
import { loginAction } from '../../store/api-actions';
import { NameSpace } from '../../store/const';
import { vi } from 'vitest';
import { changeCity } from '../../store/action';

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

  it('should enable submit button only when both email and password are valid', async () => {
    const store = mockStore(makeFakeStore());
    render(
      <Provider store={store}>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </Provider>
    );

    const emailInput = screen.getByPlaceholderText(/Email/i);
    const passwordInput = screen.getByPlaceholderText(/Password/i);
    const submitButton = screen.getByRole('button', { name: /Sign in/i });

    expect(submitButton).toBeDisabled();

    await userEvent.type(passwordInput, 'valid1');
    expect(submitButton).toBeDisabled();

    await userEvent.type(emailInput, 'test@test.com');
    expect(submitButton).toBeEnabled();

    await userEvent.clear(passwordInput);
    await userEvent.type(passwordInput, 'invalid');
    expect(submitButton).toBeDisabled();

    await userEvent.clear(passwordInput);
    await userEvent.type(passwordInput, 'valid1');
    expect(submitButton).toBeEnabled();

    await userEvent.clear(emailInput);
    expect(submitButton).toBeDisabled();
  });

  it('should dispatch loginAction on form submit with valid data', async () => {
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

  it('should render a random city link and dispatch changeCity action on click', async () => {
    const store = mockStore(makeFakeStore());
    const mockRandom = vi.spyOn(Math, 'random').mockReturnValue(0.6);
    const selectedCity = CITIES[Math.floor(CITIES.length * 0.6)];
    render(
      <Provider store={store}>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </Provider>
    );
    const cityLink = screen.getByRole('link', { name: selectedCity.name });
    expect(cityLink).toBeInTheDocument();
    await userEvent.click(cityLink);
    const actions = store.getActions();
    const changeCityAction = actions.find(
      (action) => action.type === changeCity.type
    );
    expect(changeCityAction).toBeDefined();
    expect((changeCityAction as ReturnType<typeof changeCity>).payload).toBe(
      selectedCity.name
    );
    mockRandom.mockRestore();
  });
});
