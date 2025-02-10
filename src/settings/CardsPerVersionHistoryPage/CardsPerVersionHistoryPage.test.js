import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { screen } from '@folio/jest-config-stripes/testing-library/react';

import { CardsPerVersionHistoryPage } from './CardsPerVersionHistoryPage';

import {
  renderWithIntl,
  translationsProperties,
} from '../../../test/jest/helpers';

jest.mock('./components', () => ({
  CardsPerVersionHistoryPageForm: jest.fn(() => <div>CardsPerVersionHistoryPageForm</div>),
}));

describe('CardsPerVersionHistoryPage', () => {
  const renderCardsPerVersionHistoryPage = () => (renderWithIntl(
    <MemoryRouter>
      <CardsPerVersionHistoryPage />
    </MemoryRouter>,
    translationsProperties
  ));

  it('should render the "CardsPerVersionHistoryPageForm" component', () => {
    renderCardsPerVersionHistoryPage();

    expect(screen.getByText('CardsPerVersionHistoryPageForm')).toBeInTheDocument();
  });
});
