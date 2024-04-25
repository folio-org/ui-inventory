import {
  fireEvent,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

import '../../../../test/jest/__mock__';

import {
  renderWithIntl,
  translationsProperties,
} from '../../../../test/jest/helpers';

import InstanceLoadingPane from './InstanceLoadingPane';

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  Icon: jest.fn(({ children, icon }) => (children || <span>{icon}</span>)),
}));

const mockOnClose = jest.fn();

const renderInstanceLoadingPane = () => {
  const component = <InstanceLoadingPane onClose={mockOnClose} />;

  return renderWithIntl(component, translationsProperties);
};

describe('InstanceLoadingPane', () => {
  it('should render loading spinner', () => {
    renderInstanceLoadingPane();

    expect(screen.getByText('spinner-ellipsis')).toBeInTheDocument();
  });

  it('should render correct header', () => {
    renderInstanceLoadingPane();

    expect(screen.getByText('Edit')).toBeInTheDocument();
  });

  it('should not render action menu', () => {
    renderInstanceLoadingPane();

    expect(screen.queryByRole('button', { name: 'Actions' })).not.toBeInTheDocument();
  });

  it('should call onClose cb when pane is closed', () => {
    renderInstanceLoadingPane();

    fireEvent.click(screen.getByRole('button', { name: 'Close Edit' }));

    expect(mockOnClose).toHaveBeenCalled();
  });
});
