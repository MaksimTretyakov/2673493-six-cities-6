import React from 'react';
import Card from '../card/card';
import { Offer } from '../../types/offer';

type CardListProps = {
  offers: Offer[];
  onCardHover?: (offerId: string | null) => void;
  listClassName?: string;
  cardClassNamePrefix?: 'cities' | 'near-places';
};

function CardList({
  offers,
  onCardHover,
  listClassName = 'cities__places-list places__list tabs__content',
  cardClassNamePrefix = 'cities',
}: CardListProps): JSX.Element {
  return (
    <div className={listClassName}>
      {offers.map((offer) => (
        <Card
          key={offer.id}
          offer={offer}
          onCardHover={onCardHover}
          classNamePrefix={cardClassNamePrefix}
        />
      ))}
    </div>
  );
}

const MemoizedCardList = React.memo(CardList);
export default MemoizedCardList;
