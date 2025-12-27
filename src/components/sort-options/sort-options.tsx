import React, { useState, useCallback } from 'react';
import { SortingOption } from '../../consts';

type SortOptionsProps = {
  currentSortType: string;
  onSortTypeChange: (sortType: string) => void;
};

function SortOptions({
  currentSortType,
  onSortTypeChange,
}: SortOptionsProps): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);

  const handleTypeClick = useCallback(() => {
    setIsOpen((prevIsOpen) => !prevIsOpen);
  }, []);

  const handleOptionClick = useCallback(
    (sortType: string) => {
      onSortTypeChange(sortType);
      setIsOpen(false);
    },
    [onSortTypeChange]
  );

  return (
    <form className="places__sorting" action="#" method="get">
      <span className="places__sorting-caption">Sort by</span>
      <span
        className="places__sorting-type"
        tabIndex={0}
        onClick={handleTypeClick}
      >
        {currentSortType}
        <svg className="places__sorting-arrow" width="7" height="4">
          <use xlinkHref="#icon-arrow-select"></use>
        </svg>
      </span>
      <ul
        className={`places__options places__options--custom ${
          isOpen ? 'places__options--opened' : ''
        }`}
      >
        {Object.values(SortingOption).map((option) => (
          <li
            key={option}
            className={`places__option ${
              currentSortType === option ? 'places__option--active' : ''
            }`}
            tabIndex={0}
            onClick={() => handleOptionClick(option)}
          >
            {option}
          </li>
        ))}
      </ul>
    </form>
  );
}

const MemoizedSortOptions = React.memo(SortOptions);
export default MemoizedSortOptions;
