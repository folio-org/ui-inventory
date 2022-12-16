import '../../test/jest/__mock__';
import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { Heading, Message } from './Confirmation';

describe('Confirmation', () => {
  it('should render remote confirmation message', () => {
    const { getByText } = render(
      <IntlProvider>
        <Heading />
      </IntlProvider>
    );
    expect(getByText('ui-inventory.remote.confirmation.heading')).toBeInTheDocument();
  });
  it('should render remote items message', () => {
    render(
      <IntlProvider>
        <Message />
      </IntlProvider>
    );
    expect(screen.getByText('ui-inventory.remote.confirmation.message')).toBeInTheDocument();
  });
});
