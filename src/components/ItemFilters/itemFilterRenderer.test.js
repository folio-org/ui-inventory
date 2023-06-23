import React from 'react';
import { screen } from '@folio/jest-config-stripes/testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { noop } from 'lodash';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

import '../../../test/jest/__mock__';

import itemFilterRenderer from './itemFilterRenderer';
import renderWithIntl from '../../../test/jest/helpers/renderWithIntl';
import translationsProperties from '../../../test/jest/helpers/translationsProperties';

jest.mock('./ItemFilters', () => ({ onClear }) => (
  <div>
    <button
      type="button"
      data-testid="onClear"
      onClick={() => onClear('name')}
    >
      Clear
    </button>
  </div>
));

const DATA = {
  materialTypes: [],
  locations: [],
  tags: [],
  query: {},
  parentResources: { facets: { records: [] } },
};

const renderFilters = (data = DATA, onChange = noop) => (renderWithIntl(
  <Router>{itemFilterRenderer(data)(onChange)}</Router>,
  translationsProperties
));

describe('itemFilterRenderer fn', () => {
  beforeEach(() => renderFilters());

  it('should click the clearButton', () => {
    const clearButton = screen.getByTestId('onClear');
    expect(clearButton).toBeInTheDocument();
    userEvent.click(clearButton);
  });
});
