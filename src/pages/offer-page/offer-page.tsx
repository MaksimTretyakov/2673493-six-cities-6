import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useMemo, useCallback } from 'react';
import CommentForm from '../../components/comment-form/comment-form';
import ReviewsList from '../../components/reviews-list/reviews-list';
import Map from '../../components/map/map';
import CardList from '../../components/card-list/card-list';
import { RootState, AppDispatch } from '../../store';
import Header from '../../components/header/header';
import {
  fetchOfferAction,
  fetchCommentsAction,
  fetchNearbyOffersAction,
  toggleFavoriteStatusAction,
} from '../../store/api-actions';
import Spinner from '../../components/spinner/spinner';
import { AuthorizationStatus } from '../../consts';
import { NameSpace } from '../../store/const';
import { selectSortedComments } from '../../store/selectors';

const MAX_REVIEWS_COUNT = 10;
const MAX_NEARBY_OFFERS = 3;

function OfferPage(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const sortedComments = useSelector(selectSortedComments);
  const {
    currentOffer,
    nearbyOffers,
    isOfferDataLoading,
    authorizationStatus,
  } = useSelector((state: RootState) => ({
    currentOffer: state[NameSpace.Data].currentOffer,
    nearbyOffers: state[NameSpace.Data].nearbyOffers,
    isOfferDataLoading: state[NameSpace.Data].isOfferDataLoading,
    authorizationStatus: state[NameSpace.User].authorizationStatus,
  }));

  const commentsToDisplay = useMemo(
    () => sortedComments.slice(0, MAX_REVIEWS_COUNT),
    [sortedComments]
  );
  const nearbyOffersToDisplay = useMemo(
    () => nearbyOffers.slice(0, MAX_NEARBY_OFFERS),
    [nearbyOffers]
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchOfferAction(id));
      dispatch(fetchCommentsAction(id));
      dispatch(fetchNearbyOffersAction(id));
    }
  }, [id, dispatch]);

  const allOffersForMap = useMemo(() => {
    if (currentOffer) {
      return [...nearbyOffersToDisplay, currentOffer];
    }
    return nearbyOffersToDisplay;
  }, [nearbyOffersToDisplay, currentOffer]);

  const handleBookmarkClick = useCallback(() => {
    if (authorizationStatus !== AuthorizationStatus.Auth) {
      navigate('/login');
      return;
    }
    if (currentOffer) {
      const newStatus = currentOffer.isFavorite ? 0 : 1;
      dispatch(
        toggleFavoriteStatusAction({
          offerId: currentOffer.id,
          status: newStatus,
        })
      );
    }
  }, [authorizationStatus, navigate, currentOffer, dispatch]);

  if (isOfferDataLoading) {
    return <Spinner />;
  }

  if (!currentOffer) {
    return <Navigate to="/404" />;
  }

  const {
    images,
    title,
    isPremium,
    isFavorite,
    rating,
    type,
    bedrooms,
    maxAdults,
    price,
    goods,
    host,
    description,
  } = currentOffer;

  const isLoggedIn = authorizationStatus === AuthorizationStatus.Auth;

  return (
    <div className="page">
      <Header />
      <main className="page__main page__main--offer">
        <section className="offer">
          <div className="offer__gallery-container container">
            <div className="offer__gallery">
              {images.slice(0, 6).map((imageSrc) => (
                <div key={imageSrc} className="offer__image-wrapper">
                  <img className="offer__image" src={imageSrc} alt={title} />
                </div>
              ))}
            </div>
          </div>
          <div className="offer__container container">
            <div className="offer__wrapper">
              {isPremium && (
                <div className="offer__mark">
                  <span>Premium</span>
                </div>
              )}
              <div className="offer__name-wrapper">
                <h1 className="offer__name">{title}</h1>
                <button
                  className={`offer__bookmark-button ${
                    isFavorite ? 'offer__bookmark-button--active' : ''
                  } button`}
                  type="button"
                  onClick={handleBookmarkClick}
                >
                  <svg className="offer__bookmark-icon" width="31" height="33">
                    <use xlinkHref="#icon-bookmark"></use>
                  </svg>
                  <span className="visually-hidden">To bookmarks</span>
                </button>
              </div>
              <div className="offer__rating rating">
                <div className="offer__stars rating__stars">
                  <span style={{ width: `${Math.round(rating) * 20}%` }}></span>
                  <span className="visually-hidden">Rating</span>
                </div>
                <span className="offer__rating-value rating__value">
                  {rating}
                </span>
              </div>
              <ul className="offer__features">
                <li className="offer__feature offer__feature--entire">
                  {type}
                </li>
                <li className="offer__feature offer__feature--bedrooms">
                  {bedrooms} Bedroom{bedrooms !== 1 && 's'}
                </li>
                <li className="offer__feature offer__feature--adults">
                  Max {maxAdults} adult{maxAdults !== 1 && 's'}
                </li>
              </ul>
              <div className="offer__price">
                <b className="offer__price-value">&euro;{price}</b>
                <span className="offer__price-text">&nbsp;night</span>
              </div>
              <div className="offer__inside">
                <h2 className="offer__inside-title">What&apos;s inside</h2>
                <ul className="offer__inside-list">
                  {goods.map((good) => (
                    <li key={good} className="offer__inside-item">
                      {good}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="offer__host">
                <h2 className="offer__host-title">Meet the host</h2>
                <div className="offer__host-user user">
                  <div
                    className={`offer__avatar-wrapper ${
                      host.isPro ? 'offer__avatar-wrapper--pro' : ''
                    } user__avatar-wrapper`}
                  >
                    <img
                      className="offer__avatar user__avatar"
                      src={host.avatarUrl}
                      width="74"
                      height="74"
                      alt="Host avatar"
                    />
                  </div>
                  <span className="offer__user-name">{host.name}</span>
                  {host.isPro && (
                    <span className="offer__user-status">Pro</span>
                  )}
                </div>
                <div className="offer__description">
                  <p className="offer__text">{description}</p>
                </div>
              </div>
              <section className="offer__reviews reviews">
                <ReviewsList reviews={commentsToDisplay} />
                {isLoggedIn && id && <CommentForm offerId={id} />}
              </section>
            </div>
          </div>
          <Map
            className="offer__map map"
            city={currentOffer.city}
            offers={allOffersForMap}
            selectedOfferId={currentOffer.id}
          />
        </section>
        <div className="container">
          <section className="near-places places">
            <h2 className="near-places__title">
              Other places in the neighbourhood
            </h2>
            <CardList
              offers={nearbyOffersToDisplay}
              listClassName="near-places__list places__list"
              cardClassNamePrefix="near-places"
            />
          </section>
        </div>
      </main>
    </div>
  );
}

export default OfferPage;
