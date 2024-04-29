import '../../../test/jest/__mock__';
import { screen } from '@folio/jest-config-stripes/testing-library/react';
import InstancePlugin from './InstancePlugin';
import { renderWithIntl } from '../../../test/jest/helpers';

const onSelectMock = jest.fn();

describe('InstancePlugin', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render InstancePlugin', () => {
    renderWithIntl(<InstancePlugin onSelect={onSelectMock} isDisabled={false} />);

    expect(screen.getByText(/findInstancePluginNotFound/i)).toBeInTheDocument();
  });
});

