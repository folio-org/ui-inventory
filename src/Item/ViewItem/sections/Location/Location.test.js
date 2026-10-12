import { screen } from '@folio/jest-config-stripes/testing-library/react';
import { runAxeTest } from '@folio/stripes-testing';

import '../../../../../test/jest/__mock__';

import {
  renderWithIntl,
  translationsProperties,
} from '../../../../../test/jest/helpers';

import Location from './Location';

const defaultProps = {
  holdingLocation: {
    permanentLocation: {
      name: 'Main Library',
      isActive: true
    },
    temporaryLocation: {
      name: 'Special Collections',
      isActive: true
    }
  },
  itemLocation: {
    permanentLocation: {
      name: 'ABA Library',
      isActive: true
    },
    temporaryLocation: {
      name: 'Special Collections for item',
      isActive: true
    },
    effectiveLocation: {
      name: 'Other library',
      isActive: true
    }
  }
};

const renderLocation = (props) => {
  const component = (
    <Location
      {...defaultProps}
      {...props}
    />
  );

  return renderWithIntl(component, translationsProperties);
};

describe('Location', () => {
  it('should be rendered with no axe errors', async () => {
    const { container } = renderLocation();
    await runAxeTest({ rootNode: container });
  });

  it('should render accordion with correct label', () => {
    renderLocation();
    expect(screen.getByText('Location')).toBeInTheDocument();
  });

  it('should render holdings location section with correct values', () => {
    renderLocation();

    expect(screen.getByText('Holdings location')).toBeInTheDocument();

    expect(screen.getAllByText('Permanent')[0]).toBeInTheDocument();
    expect(screen.getByText('Main Library')).toBeInTheDocument();

    expect(screen.getAllByText('Temporary')[0]).toBeInTheDocument();
    expect(screen.getByText('Special Collections')).toBeInTheDocument();
  });

  it('should render item location section with correct values', () => {
    renderLocation();

    expect(screen.getByText('Item location')).toBeInTheDocument();

    expect(screen.getAllByText('Permanent')[1]).toBeInTheDocument();
    expect(screen.getByText('ABA Library')).toBeInTheDocument();

    expect(screen.getAllByText('Temporary')[1]).toBeInTheDocument();
    expect(screen.getByText('Special Collections for item')).toBeInTheDocument();

    expect(screen.getByText('Effective location for item')).toBeInTheDocument();
    expect(screen.getByText('Other library')).toBeInTheDocument();
  });

  it('should render inactive label for inactive locations', () => {
    const props = {
      holdingLocation: {
        permanentLocation: {
          name: 'Main Library',
          isActive: false
        },
        temporaryLocation: {
          name: 'Special Collections',
          isActive: false
        }
      },
      itemLocation: {
        permanentLocation: {
          name: 'Main Library',
          isActive: false
        },
        temporaryLocation: {
          name: 'Special Collections',
          isActive: false
        },
        effectiveLocation: {
          name: 'Special Collections',
          isActive: false
        }
      }
    };

    renderLocation(props);

    const inactiveLabels = screen.getAllByText('Inactive');
    expect(inactiveLabels).toHaveLength(5);
  });

  it('should render NoValue component for missing locations', () => {
    const props = {
      holdingLocation: {
        permanentLocation: null,
        temporaryLocation: null
      },
      itemLocation: {
        permanentLocation: null,
        temporaryLocation: null,
        effectiveLocation: null
      }
    };

    renderLocation(props);

    const noValueElements = screen.getAllByText('-');
    expect(noValueElements).toHaveLength(5);
  });
});
