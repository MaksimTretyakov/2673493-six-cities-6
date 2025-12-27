import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SortOptions from './sort-options';
import { SortingOption } from '../../consts';
import { vi } from 'vitest';

describe('Component: SortOptions', () => {
  it('should render correctly', () => {
    render(
      <SortOptions
        currentSortType={SortingOption.Popular}
        onSortTypeChange={vi.fn()}
      />
    );
    const displaySpan = screen.getByText('Sort by').nextElementSibling;
    expect(displaySpan).toHaveTextContent(SortingOption.Popular);
    expect(displaySpan).toBeInTheDocument();
  });

  it('should open and close options on click', async () => {
    render(
      <SortOptions
        currentSortType={SortingOption.Popular}
        onSortTypeChange={vi.fn()}
      />
    );
    const sortingTypeElement = screen.getByText('Sort by')
      .nextElementSibling as HTMLElement;
    const optionsList = screen.getByRole('list', { hidden: true });

    expect(optionsList).not.toHaveClass('places__options--opened');
    await userEvent.click(sortingTypeElement);
    expect(optionsList).toHaveClass('places__options--opened');
    await userEvent.click(sortingTypeElement);
    expect(optionsList).not.toHaveClass('places__options--opened');
  });

  it('should call onSortTypeChange with new value and close on option click', async () => {
    const handleSortChange = vi.fn();
    render(
      <SortOptions
        currentSortType={SortingOption.Popular}
        onSortTypeChange={handleSortChange}
      />
    );
    const sortingTypeElement = screen.getByText('Sort by')
      .nextElementSibling as HTMLElement;
    await userEvent.click(sortingTypeElement);
    const newOption = screen.getByText(SortingOption.PriceLowToHigh, {
      selector: 'li',
    });
    await userEvent.click(newOption);

    expect(handleSortChange).toHaveBeenCalledWith(SortingOption.PriceLowToHigh);
    expect(screen.getByRole('list', { hidden: true })).not.toHaveClass(
      'places__options--opened'
    );
  });
});
