import React from 'react';
import '../../test/jest/__mock__';
import { renderWithIntl, translationsProperties } from '../../test/jest/helpers';

import { Heading, Message } from './Confirmation';

describe('Confirmation', () => {
  it('should render remote confirmation heading', () => {
    const { getByText } = renderWithIntl(<Heading />, translationsProperties);
    expect(getByText(/Removing from remote storage/i)).toBeInTheDocument();
  });
  it('should render remote confirmation message', () => {
    const { getByText } = renderWithIntl(<Message />, translationsProperties);
    expect(getByText(/Are you sure you want to remove this item from remote storage/i)).toBeInTheDocument();
  });
});
