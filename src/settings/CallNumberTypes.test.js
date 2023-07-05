import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import '../../test/jest/__mock__';

import { ControlledVocab } from '@folio/stripes/smart-components';

import * as utils from '../utils';

import {
  renderWithIntl,
  stripesStub,
  translationsProperties
} from '../../test/jest/helpers';

import CallNumberTypes from './CallNumberTypes';

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
      renderCallNumberTypes();

      const actionSuppressor = {
        delete: expect(utils.sourceSuppressor).toHaveBeenCalledWith('system'),
        edit: expect(utils.sourceSuppressor).toHaveBeenCalledWith('system'),
      };

      expect(ControlledVocab).toHaveBeenCalledWith(expect.objectContaining({ actionSuppressor }), {});
    });
  });
});
