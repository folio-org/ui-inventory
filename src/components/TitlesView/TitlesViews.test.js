import { FormattedMessage } from 'react-intl';
import { BrowserRouter as Router } from 'react-router-dom';

import '../../../test/jest/__mock__';

import { screen } from '@folio/jest-config-stripes/testing-library/react';

import {
  renderWithIntl,
  translationsProperties,
} from '../../../test/jest/helpers';

import TitlesViews from './TitlesView';

const defaultProps = {
  titles: [{
    id: 'titleId',
    rowIndex: 0,
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
  }],
  id: 'precedingTitles',
  label: <FormattedMessage id="ui-inventory.precedingTitles" />,
  titleKey: 'precedingInstanceId',
  identifierTypesById: {
    issnId: { name: 'ISSN' },
    isbnId: { name: 'ISBN' },
  },
};

const renderTitlesViews = (props = {}) => renderWithIntl(
  <Router>
      <TitlesViews
      {...defaultProps}
      {...props}
    />
  </Router>,
  translationsProperties,
);

describe('TitlesViews', () => {
  it('should render a table', () => {
    renderTitlesViews();

    expect(screen.getByText('Preceding titles')).toBeInTheDocument();
  });


  it('with correct columns', () => {
    renderTitlesViews();

    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Instance HRID')).toBeInTheDocument();
    expect(screen.getByText('ISBN')).toBeInTheDocument();
    expect(screen.getByText('ISSN')).toBeInTheDocument();
  });

  it('should render correct content', () => {
    renderTitlesViews();

    expect(screen.getByText('Liebigs Annalen/Recueil (Online)')).toBeInTheDocument();
    expect(screen.getByText('0165-0513')).toBeInTheDocument();
    expect(screen.getByText('0947-3440')).toBeInTheDocument();
  });

  describe('when instance title has id', () => {
    it('should render title as a link', () => {
      renderTitlesViews({ titleKey: 'id' });

      const title = screen.getByText('Liebigs Annalen/Recueil (Online)')

      expect(title.href).toContain('/inventory/view/titleId');
    });
  });

  describe('when instance title has no id', () => {
    it('should render tooltip next to the title', () => {
      renderTitlesViews();

      expect(screen.getByRole('tooltip', { name: 'Search for Liebigs Annalen/Recueil (Online)' })).toBeInTheDocument()
    });
  });
});
