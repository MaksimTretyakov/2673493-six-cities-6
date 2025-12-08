import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import LoginPage from '../../pages/login-page/login-page';
import FavoritesPage from '../../pages/favorites-page/favorites-page';
import OfferPage from '../../pages/offer-page/offer-page';
import NotFoundPage from '../../pages/not-found-page/not-found-page';
import PrivateRoute from '../private-route/private-route';
import MainPage from '../../pages/main-page/main-page';
import { RootState } from '../../store';
import Spinner from '../spinner/spinner';
import React, { useEffect } from 'react';
import { setError } from '../../store/action';

const ERROR_TIMEOUT = 5000;

function ErrorMessage(): JSX.Element | null {
  const error = useSelector((state: RootState) => state.error);
  const dispatch = useDispatch();

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(setError(null));
      }, ERROR_TIMEOUT);

      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  if (!error) {
    return null;
  }

  const style: React.CSSProperties = {
    position: 'fixed',
    top: '30px',
    left: '50%',
    transform: 'translateX(-50%)',
    padding: '10px 20px',
    backgroundColor: '#d9534f',
    color: 'white',
    borderRadius: '5px',
    zIndex: 1000,
  };

  return <div style={style}>{error}</div>;
}

function App(): JSX.Element {
  const authorizationStatus = false;
  const isOffersDataLoading = useSelector(
    (state: RootState) => state.isOffersDataLoading
  );

  if (isOffersDataLoading) {
    return <Spinner />;
  }

  return (
    <BrowserRouter>
      <ErrorMessage />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/favorites"
          element={
            <PrivateRoute authorizationStatus={authorizationStatus}>
              <FavoritesPage />
            </PrivateRoute>
          }
        />
        <Route path="/offer/:id" element={<OfferPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
