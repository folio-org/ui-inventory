import {
  fireEvent,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

import '../../../../test/jest/__mock__';

import {
  renderWithIntl,
  translationsProperties,
} from '../../../../test/jest/helpers';

import InstanceWarningPane from './InstanceWarningPane';

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  Icon: jest.fn(({ children, icon }) => (children || <span>{icon}</span>)),
}));

const mockOnClose = jest.fn();

const renderInstanceLoadingPane = (messageBannerText = 'warning text') => {
  const component = (
    <InstanceWarningPane
      onClose={mockOnClose}
      messageBannerText={messageBannerText}
    />
  );

  return renderWithIntl(component, translationsProperties);
};

describe('InstanceWarningPane', () => {
  it('should render warning banner', () => {
    renderInstanceLoadingPane();

    expect(screen.getByText('warning text')).toBeInTheDocument();
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
