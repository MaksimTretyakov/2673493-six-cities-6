import { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import CardList from '../../components/card-list/card-list';
import Map from '../../components/map/map';
import CitiesList from '../../components/cities-list/cities-list';
import { CITIES } from '../../consts';
import { changeCity, changeSortType } from '../../store/action';
import { fetchOffersAction } from '../../store/api-actions';
import { AppDispatch } from '../../store';
import Header from '../../components/header/header';
import {
  selectCity,
  selectOffersForCity,
  selectSortedOffersForCity,
  selectSortType,
} from '../../store/selectors';
import SortOptions from '../../components/sort-options/sort-options';
import MainEmpty from '../../components/main-empty/main-empty';

function MainPage(): JSX.Element {
  const [selectedOfferId, setSelectedOfferId] = useState<string | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const selectedCity = useSelector(selectCity);
  const offersForCity = useSelector(selectOffersForCity);
  const currentSortType = useSelector(selectSortType);
  const sortedOffers = useSelector(selectSortedOffersForCity);

  useEffect(() => {
    dispatch(fetchOffersAction());
  }, [dispatch]);

  const handleCityClick = useCallback(
    (cityName: string) => {
      dispatch(changeCity(cityName));
    },
    [dispatch]
  );

  const handleSortTypeChange = useCallback(
    (sortType: string) => {
      dispatch(changeSortType(sortType));
    },
    [dispatch]
  );

  const cityData = CITIES.find((city) => city.name === selectedCity);
  const placesCount = offersForCity.length;

  const handleCardHover = useCallback((offerId: string | null) => {
    setSelectedOfferId(offerId);
  }, []);

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
                <SortOptions
                  currentSortType={currentSortType}
                  onSortTypeChange={handleSortTypeChange}
                />
                <CardList offers={sortedOffers} onCardHover={handleCardHover} />
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
            <MainEmpty selectedCity={selectedCity} />
          )}
        </div>
      </main>
    </div>
  );
}

export default MainPage;
