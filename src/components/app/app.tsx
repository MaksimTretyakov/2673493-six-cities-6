import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from '../../pages/login-page/login-page';
import FavoritesPage from '../../pages/favorites-page/favorites-page';
import OfferPage from '../../pages/offer-page/offer-page';
import NotFoundPage from '../../pages/not-found-page/not-found-page';
import PrivateRoute from '../private-route/private-route';
import MainPage from '../../pages/main-page/main-page';

type AppProps = {
  placesCount: number;
};

function App({ placesCount }: AppProps): JSX.Element {
  const authorizationStatus = false;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage placesCount={placesCount} />} />
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
