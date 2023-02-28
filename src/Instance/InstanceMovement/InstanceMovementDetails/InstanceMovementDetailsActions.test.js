import '../../../../test/jest/__mock__';

import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import InstanceMovementDetailsActions from './InstanceMovementDetailsActions';
import {
  renderWithIntl,
  translationsProperties,
} from '../../../../test/jest/helpers';

const onToggle = jest.fn();
const instance = {
  id: 'test',
  source: 'MARC'
};
const hasMarc = true;
const renderInstanceMovementDetailsActions = (props = {}) => renderWithIntl(
  <MemoryRouter>
    <InstanceMovementDetailsActions
      onToggle={onToggle}
      instance={instance}
      hasMarc={hasMarc}
      {...props}
    />
    InstanceMovementContainer component
  </MemoryRouter>,
  translationsProperties,
);

describe('InstanceMovementDetailsActions', () => {
  it('should render InstanceMovementDetailsActions', () => {
    renderInstanceMovementDetailsActions();
    expect(screen.getByText('InstanceMovementContainer component')).toBeInTheDocument();
  });

  it('should Enable Edit button', () => {
    renderInstanceMovementDetailsActions();
    userEvent.click(screen.getByText('Edit'));
    expect(screen.getByRole('button', { name: 'Edit' })).toBeEnabled();
  });

  it('should Enable View source button', () => {
    renderInstanceMovementDetailsActions();
    userEvent.click(screen.getByText('View source'));
    expect(screen.getByRole('button', { name: 'View source' })).toBeEnabled();
  });
});
