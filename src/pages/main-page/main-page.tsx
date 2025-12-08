import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import CardList from '../../components/card-list/card-list';
import Map from '../../components/map/map';
import CitiesList from '../../components/cities-list/cities-list';
import { CITIES } from '../../consts';
import { changeCity } from '../../store/action';
import { RootState } from '../../store';
import Header from '../../components/header/header';

function MainPage(): JSX.Element {
  const [selectedOfferId, setSelectedOfferId] = useState<string | null>(null);

  const dispatch = useDispatch();
  const { selectedCity, offers } = useSelector((state: RootState) => ({
    selectedCity: state.city,
    offers: state.offers,
  }));

  const handleCityClick = (cityName: string) => {
    dispatch(changeCity(cityName));
  };

  const offersForCity = offers.filter(
    (offer) => offer.city.name === selectedCity
  );
  const cityData = CITIES.find((city) => city.name === selectedCity);

  const placesCount = offersForCity.length;

  const handleCardHover = (offerId: string | null) => {
    setSelectedOfferId(offerId);
  };

  return (
    <div className="page page--gray page--main">
      <Header />

      <main
        className={`page__main page__main--index${
          placesCount === 0 ? ' page__main--index-empty' : ''
        }`}
      >
        <h1 className="visually-hidden">Cities</h1>
        <CitiesList
          cities={CITIES}
          selectedCity={selectedCity}
          onCityClick={handleCityClick}
        />
        <div className="cities">
          {placesCount > 0 && cityData ? (
            <div className="cities__places-container container">
              <section className="cities__places places">
                <h2 className="visually-hidden">Places</h2>
                <b className="places__found">
                  {placesCount} places to stay in {selectedCity}
                </b>
                <form className="places__sorting" action="#" method="get">
                  <span className="places__sorting-caption">Sort by</span>
                  <span className="places__sorting-type" tabIndex={0}>
                    Popular
                    <svg className="places__sorting-arrow" width="7" height="4">
                      <use xlinkHref="#icon-arrow-select"></use>
                    </svg>
                  </span>
                  <ul className="places__options places__options--custom places__options--opened">
                    <li
                      className="places__option places__option--active"
                      tabIndex={0}
                    >
                      Popular
                    </li>
                    <li className="places__option" tabIndex={0}>
                      Price: low to high
                    </li>
                    <li className="places__option" tabIndex={0}>
                      Price: high to low
                    </li>
                    <li className="places__option" tabIndex={0}>
                      Top rated first
                    </li>
                  </ul>
                </form>
                <CardList
                  offers={offersForCity}
                  onCardHover={handleCardHover}
                />
              </section>
              <div className="cities__right-section">
                <Map
                  city={cityData}
                  offers={offersForCity}
                  selectedOfferId={selectedOfferId}
                />
              </div>
            </div>
          ) : (
            <div className="cities__places-container cities__places-container--empty container">
              <section className="cities__no-places">
                <div className="cities__status-wrapper tabs__content">
                  <b className="cities__status">No places to stay available</b>
                  <p className="cities__status-description">
                    We could not find any property available at the moment in{' '}
                    {selectedCity}
                  </p>
                </div>
              </section>
              <div className="cities__right-section"></div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default MainPage;
