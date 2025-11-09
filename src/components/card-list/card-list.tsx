import Card from '../card/card';
import { Offer } from '../../types/offer';

type CardListProps = {
  offers: Offer[];
  onCardHover: (offerId: string | null) => void;
};

function CardList({ offers, onCardHover }: CardListProps): JSX.Element {
  return (
    <div className="cities__places-list places__list tabs__content">
      {offers.map((offer) => (
        <Card key={offer.id} offer={offer} onCardHover={onCardHover} />
      ))}
    </div>
  );
}

export default CardList;
