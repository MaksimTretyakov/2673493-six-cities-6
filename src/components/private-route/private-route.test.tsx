import { Routes, Route, MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureMockStore } from '@jedmao/redux-mock-store';
import PrivateRoute from './private-route';
import { AuthorizationStatus } from '../../consts';
import { makeFakeStore } from '../../utils/mocks';
import { NameSpace } from '../../store/const';

const mockStore = configureMockStore();
const mockFakeStore = makeFakeStore();

describe('Component: PrivateRoute', () => {
  it('should render component for public route, when user not authorized', () => {
    const store = mockStore(mockFakeStore);
    const publicText = 'public route';
    const privateText = 'private route';
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/private']}>
          <Routes>
            <Route path="/login" element={<span>{publicText}</span>} />
            <Route
              path="/private"
              element={
                <PrivateRoute>
                  <span>{privateText}</span>
                </PrivateRoute>
              }
            />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText(publicText)).toBeInTheDocument();
    expect(screen.queryByText(privateText)).not.toBeInTheDocument();
  });

  it('should render component for private route, when user authorized', () => {
    const store = mockStore({
      ...mockFakeStore,
      [NameSpace.User]: {
        ...mockFakeStore[NameSpace.User],
        authorizationStatus: AuthorizationStatus.Auth,
      },
    });
    const publicText = 'public route';
    const privateText = 'private route';

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/private']}>
          <Routes>
            <Route path="/login" element={<span>{publicText}</span>} />
            <Route
              path="/private"
              element={
                <PrivateRoute>
                  <span>{privateText}</span>
                </PrivateRoute>
              }
            />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText(privateText)).toBeInTheDocument();
    expect(screen.queryByText(publicText)).not.toBeInTheDocument();
  });
});
