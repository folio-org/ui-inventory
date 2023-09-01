import { fireEvent } from '@folio/jest-config-stripes/testing-library/react';

import '../../../test/jest/__mock__';

import {
  renderWithIntl,
  translationsProperties,
} from '../../../test/jest/helpers';

import ActionItem from './ActionItem';

const mockOnClickHandler = jest.fn();

const renderActionItem = (props) => {
  const component = (
    <ActionItem
      id="actionItemId"
      icon="actionItemIcon"
      label="action item label"
      onClickHandler={mockOnClickHandler}
      isDisabled={false}
      {...props}
    />
  );
  return renderWithIntl(component, translationsProperties);
};

describe('ActionItem', () => {
  it('should render button', () => {
    const { getByRole } = renderActionItem();

    expect(getByRole('button', { name: /action item label/i }));
  });

  it('should call handler when clicking button', () => {
    const { getByRole } = renderActionItem();
    const button = getByRole('button', { name: /action item label/i });

    fireEvent.click(button);

    expect(mockOnClickHandler).toBeCalled();
  });

  it('should be disabled when isDisabled prop is true', () => {
    const { getByRole } = renderActionItem({ isDisabled: true });
    const button = getByRole('button', { name: /action item label/i });

    expect(button).toBeDisabled();
  });
});
