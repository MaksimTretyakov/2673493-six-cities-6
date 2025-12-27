import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureMockStore } from '@jedmao/redux-mock-store';
import thunk from 'redux-thunk';
import { Mock, vi } from 'vitest';
import Card from './card';
import { makeFakeOffer, makeFakeStore } from '../../utils/mocks';
import { AuthorizationStatus } from '../../consts';
import { toggleFavoriteStatusAction } from '../../store/api-actions';
import { NameSpace } from '../../store/const';

vi.mock('react-router-dom', async () => {
  const actual: typeof import('react-router-dom') = await vi.importActual(
    'react-router-dom'
  );
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
const mockOffer = makeFakeOffer();

describe('Component: Card', () => {
  it('should render correctly', () => {
    const store = mockStore(makeFakeStore());
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Card offer={mockOffer} />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText(mockOffer.title)).toBeInTheDocument();
    expect(screen.getByText(`€${mockOffer.price}`)).toBeInTheDocument();
  });

  it('should show premium mark if offer is premium', () => {
    const premiumOffer = { ...mockOffer, isPremium: true };
    const store = mockStore(makeFakeStore());
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Card offer={premiumOffer} />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Premium')).toBeInTheDocument();
  });

  it('should dispatch toggleFavoriteStatusAction on bookmark click if user is authorized', async () => {
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
        <MemoryRouter>
          <Card offer={mockOffer} />
        </MemoryRouter>
      </Provider>
    );

    await userEvent.click(screen.getByRole('button'));

    const actions = store.getActions();
    expect(
      actions.some(
        (action) => action.type === toggleFavoriteStatusAction.pending.type
      )
    ).toBe(true);
  });

  it('should navigate to login on bookmark click if user is not authorized', async () => {
    const mockNavigate = vi.fn();
    (useNavigate as Mock).mockReturnValue(mockNavigate);

    const store = mockStore(makeFakeStore());
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Card offer={mockOffer} />
        </MemoryRouter>
      </Provider>
    );

    await userEvent.click(screen.getByRole('button'));
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});
