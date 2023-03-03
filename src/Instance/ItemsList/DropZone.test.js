import React from 'react';
import { screen } from '@testing-library/react';

import '../../../test/jest/__mock__';

import { Router } from 'react-router';
import { createMemoryHistory } from 'history';

import { DataContext } from '../../contexts';

import { renderWithIntl, translationsProperties } from '../../../test/jest/helpers';

import DropZone from './DropZone';

const history = new createMemoryHistory();

const defaultProps = {
  isItemsDroppable: true,
  droppableId: 'test-droppable-id',
  isDropDisabled: false,
  children: <div data-testid="child">Child Element</div>
};

const renderDropZone = (props) => renderWithIntl(
  <Router history={history}>
    <DataContext.Provider value={{ isDropDisabled: false }}>
        <DropZone {...props} /> 
    </DataContext.Provider>
  </Router>,
  translationsProperties
);

describe('DropZone', () => {
  it('renders Droppable component', () => {
    const { getByText } = renderDropZone(defaultProps);
    expect(getByText(/Child Element/i)).toBeInTheDocument();
  });
  it('throws an error if props are of the wrong type', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const props = {
      isItemsDroppable: 'not-a-bool',
      droppableId: 123,
      isDropDisabled: 'not-a-bool-either',
      children: 'not-a-valid-child',
    };
    expect(() => {
      render(<DropZone {...props} />);
    }).toThrow();
    consoleSpy.mockRestore();
  });
});
