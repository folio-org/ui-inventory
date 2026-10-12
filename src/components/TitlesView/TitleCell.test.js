import { BrowserRouter as Router } from 'react-router-dom';

import '../../../test/jest/__mock__';

import { screen } from '@folio/jest-config-stripes/testing-library/react';

import {
  renderWithIntl,
  translationsProperties,
} from '../../../test/jest/helpers';

import TitleCell from './TitleCell';

const defaultProps = {
  rowData: {
    id: 'titleId',
    title: 'Liebigs Annalen/Recueil (Online)',
    identifiers: [
      {
        value: '0165-0513',
        identifierTypeId: 'issnId',
      },
      {
        value: '0947-3440',
        identifierTypeId: 'isbnId',
      }
    ],
  },
  titleKey: 'precedingInstanceId',
  identifierTypesById: {
    issnId: { name: 'ISSN' },
    isbnId: { name: 'ISBN' },
  },
};

const renderTitleCell = (props = {}) => renderWithIntl(
  <Router>
    <TitleCell
      {...defaultProps}
      {...props}
    />
  </Router>,
  translationsProperties,
);

describe('TitleCell', () => {
  describe('when no title provided', () => {
    it('should render no value', () => {
      renderTitleCell({ rowData: {} });

      expect(screen.getByText('-')).toBeInTheDocument();
    });
  });

  describe('when instance title has id', () => {
    it('should render title as a link', () => {
      renderTitleCell({ titleKey: 'id' });

      const title = screen.getByText('Liebigs Annalen/Recueil (Online)');

      expect(title.href).toContain('/inventory/view/titleId');
    });
  });

  describe('when instance title has no id', () => {
    it('should render tooltip and search button next to the title', () => {
      renderTitleCell();

      const tooltip = screen.getByRole('tooltip', { name: 'Search for Liebigs Annalen/Recueil (Online)' });
      const searchButton = screen.getByLabelText('Search for Liebigs Annalen/Recueil (Online)');

      expect(tooltip).toBeInTheDocument();
      expect(searchButton).toBeInTheDocument();
      expect(searchButton.href).toContain('/inventory?qindex=advancedSearch&query=title+exactPhrase+Liebigs+Annalen%2FRecueil+%28Online%29+and+isbn+containsAll+0947-3440+and+issn+containsAll+0165-0513');
    });
  });
});
