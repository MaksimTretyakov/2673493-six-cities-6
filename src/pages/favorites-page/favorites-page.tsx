import { useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import Header from '../../components/header/header';
import {
  fetchFavoriteOffersAction,
  toggleFavoriteStatusAction,
} from '../../store/api-actions';
import {
  selectFetchedFavorites,
  selectGroupedFetchedFavorites,
} from '../../store/selectors';
import { AuthorizationStatus } from '../../consts';
import { NameSpace } from '../../store/const';

function FavoritesPage(): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const offers = useSelector(selectFetchedFavorites);
  const groupedOffers = useSelector(selectGroupedFetchedFavorites);
  const authorizationStatus = useSelector(
    (state: RootState) => state[NameSpace.User].authorizationStatus
  );

  const cities = Object.keys(groupedOffers);
  const isEmpty = offers.length === 0;

  useEffect(() => {
    dispatch(fetchFavoriteOffersAction());
  }, [dispatch]);

  const handleBookmarkClick = useCallback(
    (offerId: string, isFavorite: boolean) => {
      if (authorizationStatus !== AuthorizationStatus.Auth) {
        navigate('/login');
        return;
      }
      const newStatus = isFavorite ? 0 : 1;
      dispatch(toggleFavoriteStatusAction({ offerId, status: newStatus }));
    },
    [authorizationStatus, dispatch, navigate]
  );

  return (
    <div className={`page ${isEmpty ? 'page--favorites-empty' : ''}`}>
      <Header />

      <main
        className={`page__main page__main--favorites ${
          isEmpty ? 'page__main--favorites-empty' : ''
        }`}
      >
        <div className="page__favorites-container container">
          <section className={`favorites ${isEmpty ? 'favorites--empty' : ''}`}>
            {isEmpty ? (
              <>
                <h1 className="visually-hidden">Favorites (empty)</h1>
                <div className="favorites__status-wrapper">
                  <b className="favorites__status">Nothing yet saved.</b>
                  <p className="favorites__status-description">
                    Save properties to narrow down search or plan your future
                    trips.
                  </p>
                </div>
              </>
            ) : (
              <>
                <h1 className="favorites__title">Saved listing</h1>
                <ul className="favorites__list">
                  {cities.map((city) => (
                    <li className="favorites__locations-items" key={city}>
                      <div className="favorites__locations locations locations--current">
                        <div className="locations__item">
                          <Link className="locations__item-link" to="/">
                            <span>{city}</span>
                          </Link>
                        </div>
                      </div>
                      <div className="favorites__places">
                        {groupedOffers[city].map((offer) => (
                          <article
                            className="favorites__card place-card"
                            key={offer.id}
                          >
                            {offer.isPremium && (
                              <div className="place-card__mark">
                                <span>Premium</span>
                              </div>
                            )}
                            <div className="favorites__image-wrapper place-card__image-wrapper">
                              <Link to={`/offer/${offer.id}`}>
                                <img
                                  className="place-card__image"
                                  src={offer.previewImage}
                                  width="150"
                                  height="110"
                                  alt={offer.title}
                                />
                              </Link>
                            </div>
                            <div className="favorites__card-info place-card__info">
                              <div className="place-card__price-wrapper">
                                <div className="place-card__price">
                                  <b className="place-card__price-value">
                                    &euro;{offer.price}
                                  </b>
                                  <span className="place-card__price-text">
                                    &#47;&nbsp;night
                                  </span>
                                </div>
                                <button
                                  className={`place-card__bookmark-button ${
                                    offer.isFavorite
                                      ? 'place-card__bookmark-button--active'
                                      : ''
                                  } button`}
                                  type="button"
                                  onClick={() =>
                                    handleBookmarkClick(
                                      offer.id,
                                      offer.isFavorite
                                    )
                                  }
                                >
                                  <svg
                                    className="place-card__bookmark-icon"
                                    width="18"
                                    height="19"
                                  >
                                    <use xlinkHref="#icon-bookmark"></use>
                                  </svg>
                                  <span className="visually-hidden">
                                    In bookmarks
                                  </span>
                                </button>
                              </div>
                              <div className="place-card__rating rating">
                                <div className="place-card__stars rating__stars">
                                  <span
                                    style={{
                                      width: `${
                                        Math.round(offer.rating) * 20
                                      }%`,
                                    }}
                                  />
                                  <span className="visually-hidden">
                                    Rating
                                  </span>
                                </div>
                              </div>
                              <h2 className="place-card__name">
                                <Link to={`/offer/${offer.id}`}>
                                  {offer.title}
                                </Link>
                              </h2>
                              <p className="place-card__type">{offer.type}</p>
                            </div>
                          </article>
                        ))}
                      </div>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </section>
        </div>
      </main>
      <footer className={`footer ${!isEmpty ? 'container' : ''}`}>
        <Link className="footer__logo-link" to="/">
          <img
            className="footer__logo"
            src="img/logo.svg"
            alt="6 cities logo"
            width="64"
            height="33"
          />
        </Link>
      </footer>
    </div>
  );
}

export default FavoritesPage;
