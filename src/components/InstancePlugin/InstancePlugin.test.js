import '../../../test/jest/__mock__';
import { screen } from '@folio/jest-config-stripes/testing-library/react';
import InstancePlugin from './InstancePlugin';
import { renderWithIntl } from '../../../test/jest/helpers';

const onSelectMock = jest.fn();

describe('InstancePlugin', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should InstancePlugin', () => {
    renderWithIntl(<InstancePlugin onSelectMock={onSelectMock} isDisabled={false} />);

    expect(screen.getByText(/findInstancePluginNotFound/i)).toBeInTheDocument();
  });

  it('should InstancePlugin with is disabled prop', () => {
    renderWithIntl(<InstancePlugin onSelectMock={onSelectMock} isDisabled />);

    expect(screen.getByText(/findInstancePluginNotFound/i)).toBeInTheDocument();
  });
});

