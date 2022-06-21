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

const props = {
  fields:{
    forEach: jest.fn(),
    update: jest.fn(),
    value: {
      contributorNameTypeId: '',
      contributorTypeText: '',
      name: '',
      primary: true,
    },
    name: 'contributors',
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
    it('then `onChange` function should be called', () => {
      renderPrimaryToggleButton(props);

      userEvent.click(screen.getByTestId('primaryToggleButton'));

      expect(mockOnChange).toHaveBeenCalledTimes(1);
    });
  });
});
