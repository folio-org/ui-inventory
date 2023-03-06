import React from 'react';
import { Router } from 'react-router';
import { createMemoryHistory } from 'history';
import { DataContext } from '../../contexts';
import '../../../test/jest/__mock__';
import { renderWithIntl, translationsProperties } from '../../../test/jest/helpers';

import DropZone from './DropZone';

const history = createMemoryHistory();

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
});
