import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

import { useNumberGeneratorOptions } from '../../common/hooks';
import withNumberGeneratorOptions from './withNumberGeneratorOptions';

jest.mock('../../common/hooks', () => ({
  useNumberGeneratorOptions: jest.fn(),
}));

const numberGeneratorData = { identifier: 'identifierGenerator' };

const TestComponent = (props) => (
  <div>
    <span>{props.numberGeneratorData?.identifier}</span>
    <span>{props.otherProp}</span>
  </div>
);

describe('withNumberGeneratorOptions', () => {
  beforeEach(() => {
    useNumberGeneratorOptions.mockClear().mockReturnValue({ data: numberGeneratorData });
  });

  it('should pass number generator options to the wrapped component', () => {
    const WrappedComponent = withNumberGeneratorOptions(TestComponent);

    render(<WrappedComponent />);

    expect(screen.getByText('identifierGenerator')).toBeInTheDocument();
  });

  it('should pass through the original props', () => {
    const WrappedComponent = withNumberGeneratorOptions(TestComponent);

    render(<WrappedComponent otherProp="testProp" />);

    expect(screen.getByText('testProp')).toBeInTheDocument();
  });
});
