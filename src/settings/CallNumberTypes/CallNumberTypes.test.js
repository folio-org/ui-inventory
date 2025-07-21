import { MemoryRouter } from 'react-router-dom';

import '../../../test/jest/__mock__';

import { ControlledVocab } from '@folio/stripes/smart-components';
import { getSourceSuppressor } from '@folio/stripes/util';

import {
  renderWithIntl,
  stripesStub,
  translationsProperties
} from '../../../test/jest/helpers';

import { RECORD_SOURCE } from '../../constants';
import CallNumberTypes from './CallNumberTypes';

jest.mock('@folio/stripes/util');

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
        delete: expect(getSourceSuppressor).toHaveBeenNthCalledWith(1, [RECORD_SOURCE.SYSTEM, RECORD_SOURCE.CONSORTIUM]),
        edit: expect(getSourceSuppressor).toHaveBeenNthCalledWith(2, [RECORD_SOURCE.SYSTEM, RECORD_SOURCE.CONSORTIUM]),
      };

      expect(ControlledVocab).toHaveBeenCalledWith(expect.objectContaining({ actionSuppressor }), {});
    });
  });
});
