import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { City } from '../../types/offer';

type CitiesListProps = {
  cities: City[];
  selectedCity: string;
  onCityClick: (city: string) => void;
};

function CitiesList({
  cities,
  selectedCity,
  onCityClick,
}: CitiesListProps): JSX.Element {
  const handleCityClick = useCallback(
    (evt: React.MouseEvent<HTMLAnchorElement>, cityName: string) => {
      evt.preventDefault();
      onCityClick(cityName);
    },
    [onCityClick]
  );

  return (
    <div className="tabs">
      <section className="locations container">
        <ul className="locations__list tabs__list">
          {cities.map((city) => (
            <li className="locations__item" key={city.name}>
              <Link
                className={`locations__item-link tabs__item ${
                  selectedCity === city.name ? 'tabs__item--active' : ''
                }`}
                to="#"
                onClick={(evt) => handleCityClick(evt, city.name)}
              >
                <span>{city.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

const MemoizedCitiesList = React.memo(CitiesList);
export default MemoizedCitiesList;
