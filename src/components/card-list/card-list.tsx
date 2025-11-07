import { useState } from 'react';
import Card from '../card/card';
import { Offer } from '../../types/offer';

type CardListProps = {
  offers: Offer[];
};

function CardList({ offers }: CardListProps): JSX.Element {
  const [, setActiveCardId] = useState<string | null>(null);

  const handleCardHover = (offerId: string | null) => {
    setActiveCardId(offerId);
  };

  return (
    <div className="cities__places-list places__list tabs__content">
      {offers.map((offer) => (
        <Card key={offer.id} offer={offer} onCardHover={handleCardHover} />
      ))}
    </div>
  );
}

export default CardList;
