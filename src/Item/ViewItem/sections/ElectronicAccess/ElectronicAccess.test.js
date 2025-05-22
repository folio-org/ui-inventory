import { screen } from '@folio/jest-config-stripes/testing-library/react';
import { runAxeTest } from '@folio/stripes-testing';

import '../../../../../test/jest/__mock__';

import {
  renderWithIntl,
  translationsProperties,
} from '../../../../../test/jest/helpers';

import ElectronicAccess from './ElectronicAccess';

const mockRefLookup = jest.fn((table, id) => table.find(item => item.id === id));

const defaultProps = {
  electronicAccess: [
    {
      relationshipId: 1,
      uri: 'http://example.com',
      linkText: 'link text',
      materialsSpecification: 'specification',
      publicNote: 'note'
    },
    {
      relationshipId: 2,
      uri: 'http://example2.com',
      linkText: 'link text 2',
      materialsSpecification: 'specification 2',
      publicNote: 'note 2'
    }
  ],
  refLookup: mockRefLookup,
  electronicAccessRelationships: [
    { id: 1, name: 'Relationship 1' },
    { id: 2, name: 'Relationship 2' }
  ],
};

const renderElectronicAccess = (props) => {
  const component = (
    <ElectronicAccess
      {...defaultProps}
      {...props}
    />
  );

  return renderWithIntl(component, translationsProperties);
};

describe('Electronic access', () => {
  it('should be rendered with no axe errors', async () => {
    const { container } = renderElectronicAccess();
    await runAxeTest({ rootNode: container });
  });

  it('should render accordion with correct label', () => {
    renderElectronicAccess();

    expect(screen.getByText('Electronic access')).toBeInTheDocument();
  });

  it('should render a list with proper columns', () => {
    renderElectronicAccess();

    expect(screen.getByRole('columnheader', { name: 'URL relationship' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'URI' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Link text' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Materials specified' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'URL public note' })).toBeInTheDocument();
  });

  it('should render electronic access items with correct data', () => {
    renderElectronicAccess();

    expect(screen.getByText('Relationship 1')).toBeInTheDocument();
    expect(screen.getByText('Relationship 2')).toBeInTheDocument();
    expect(screen.getByText('link text')).toBeInTheDocument();
    expect(screen.getByText('link text 2')).toBeInTheDocument();
    expect(screen.getByText('specification')).toBeInTheDocument();
    expect(screen.getByText('specification 2')).toBeInTheDocument();
    expect(screen.getByText('note')).toBeInTheDocument();
    expect(screen.getByText('note 2')).toBeInTheDocument();
  });

  it('should render URLs as clickable links', () => {
    renderElectronicAccess();

    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(2);

    expect(links[0]).toHaveAttribute('href', 'http://example.com');
    expect(links[1]).toHaveAttribute('href', 'http://example2.com');
  });

  it('should render NoValue component for missing fields', () => {
    const props = {
      electronicAccess: [{
        relationshipId: 1,
        uri: 'http://example.com',
      }],
      refLookup: mockRefLookup,
      electronicAccessRelationships: [{ id: 1, name: 'Relationship 1' }],
    };

    renderElectronicAccess(props);

    const noValueElements = screen.getAllByText('-');
    expect(noValueElements).toHaveLength(3);
  });
});
