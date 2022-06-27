import React from 'react';
import {
  render,
  screen,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import '../../../../test/jest/__mock__';
import Harness from '../../../../test/jest/helpers/Harness';

import PrimaryToggleButton from './PrimaryToggleButton';

jest.unmock('@folio/stripes/components');

const mockOnChange = jest.fn();
const mockUpdate = jest.fn();

const props = {
  fields: {
    forEach(cb) {
      Object.keys(this.value).forEach(cb);
    },
    update: mockUpdate,
    value: {
      contributorNameTypeId: {
        primary: false,
      },
      contributorTypeText: {
        primary: false,
      },
      name: {
        primary: true,
      },
    },
  },
  label:'Primary',
  input: {
    value: '',
    onChange: mockOnChange,
  },
  disabled: false,
};

const renderPrimaryToggleButton = () => render(
  <Harness translations={[]}>
    <PrimaryToggleButton
      {...props}
    />
  </Harness>
);

describe('Given PrimaryToggleButton component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering PrimaryToggleButton', () => {
    it('should be visible', () => {
      const { getByText } = renderPrimaryToggleButton(props);

      expect(getByText('Primary')).toBeVisible();
      expect(getByText('ui-inventory.makePrimary')).toBeDefined();
    });
  });

  describe('when user click on PrimaryToggleButton', () => {
    it('then fields `change` function should be called', () => {
      renderPrimaryToggleButton(props);

      userEvent.click(screen.getByTestId('primaryToggleButton'));

      expect(mockOnChange).toHaveBeenCalledTimes(1);

      expect(mockUpdate).toHaveBeenNthCalledWith(1, 0, { primary: false });
      expect(mockUpdate).toHaveBeenNthCalledWith(2, 1, { primary: false });
      expect(mockUpdate).toHaveBeenNthCalledWith(3, 2, { primary: false });
    });
  });
});
