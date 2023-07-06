import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import '../../test/jest/__mock__';

import { ControlledVocab } from '@folio/stripes/smart-components';
import { getSourceSuppressor } from '@folio/stripes/util';

import {
  renderWithIntl,
  stripesStub,
  translationsProperties
} from '../../test/jest/helpers';
import { RECORD_SOURCE } from '../constants';
import CallNumberTypes from './CallNumberTypes';

jest.mock('@folio/stripes/util', () => ({
  ...jest.requireActual('@folio/stripes/util'),
  getSourceSuppressor: jest.fn(),
}));
jest.mock('../utils');

const defaultProps = {
  stripes: {
    ...stripesStub,
    connect: component => component,
  },
};

const CallNumberTypesSetup = () => (
  <MemoryRouter>
    <CallNumberTypes {...defaultProps} />
  </MemoryRouter>
);

const renderCallNumberTypes = () => renderWithIntl(
  <CallNumberTypesSetup />,
  translationsProperties
);

describe('CallNumberTypes', () => {
  it('should render properly', () => {
    const { getByText } = renderCallNumberTypes();
    expect(getByText('ControlledVocab')).toBeInTheDocument();
  });

  describe('when call number type is "system"', () => {
    it('should hide the "edit" and "delete" buttons', () => {
      getSourceSuppressor.mockClear().mockReturnValue(() => true);
      renderCallNumberTypes();

      const suppressor = getSourceSuppressor(RECORD_SOURCE.SYSTEM);
      const actionSuppressor = { delete: suppressor, edit: suppressor };

      expect(ControlledVocab).toHaveBeenCalledWith(expect.objectContaining({ actionSuppressor }), {});
    });
  });
});
