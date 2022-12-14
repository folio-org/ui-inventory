import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import '../test/jest/__mock__';

import { screen } from '@testing-library/react';

import { renderWithIntl, translationsProperties } from '../test/jest/helpers';
import ViewInstanceWrapper from './ViewInstanceWrapper';

const defaultProps = {
  resources: {
    instance : {
      records : [{
        type: 'okapi',
        path: 'inventory/instances/:{id}',
        resourceShouldRefresh: true,
        throwErrors: false,
      }]
    },
  },
  match : {
    params : {
      id : '001'
    },
  },
};

const ViewInstanceWrapperSetup = () => (
  <MemoryRouter>
    <ViewInstanceWrapper {...defaultProps} />
  </MemoryRouter>
);

const renderClassificationTypesSettings = () => renderWithIntl(
  <ViewInstanceWrapperSetup />,
  translationsProperties
);

describe('ViewInstanceWrapper', () => {
  it('paneHeaderpane instancedetails', () => {
    const { getByText } = renderClassificationTypesSettings();
    expect(getByText(/Edit/i)).toBeInTheDocument();
    screen.debug();
  });
});
