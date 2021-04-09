import React from 'react';
import { screen } from '@testing-library/react';

import '../../../test/jest/__mock__';

import renderWithIntl from '../../../test/jest/helpers/renderWithIntl';
import translationsProperties from '../../../test/jest/helpers/translationsProperties';
import WarningMessage from './WarningMessage';

describe('WarningMessage', () => {
  describe('render', () => {
    it('should show warning', () => {
      renderWithIntl(
        <WarningMessage id="ui-inventory.instance.suppressedFromDiscovery" />,
        translationsProperties
      );
      expect(screen.getByText(/suppressed/i)).toBeInTheDocument();
    });
  });
});
