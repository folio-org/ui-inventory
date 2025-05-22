import { BrowserRouter as Router } from 'react-router-dom';

import '../../../../../test/jest/__mock__';

import LinkedHoldingDetails from './LinkedHoldingDetails';

import {
  renderWithIntl,
  translationsProperties,
} from '../../../../../test/jest/helpers';

const holdingsRecordMock = {
  id: 'holdingsRecordId',
  callNumberPrefix: 'callNumberPrefix',
  callNumber: 'callNumber',
  callNumberSuffix: 'callNumberSuffix',
};
const holdingLocationMock = {
  permanentLocation: {
    name: 'permanentLocationName',
    isActive: true,
  },
};

const renderLinkedHoldingDetails = () => {
  const component = (
    <Router>
      <LinkedHoldingDetails
        instance={{ id: 'instanceId' }}
        holdingsRecord={holdingsRecordMock}
        holdingLocation={holdingLocationMock}
      />
    </Router>
  );

  return renderWithIntl(component, translationsProperties);
};

describe('LinkedHoldingDetails', () => {
  it('should display linked holdings details', () => {
    const {
      getByText,
      getByRole,
    } = renderLinkedHoldingDetails();

    expect(getByText(/holdings:/i)).toBeInTheDocument();
    expect(getByRole('link', { name: /permanentLocationName > callNumberPrefix callNumber callNumberSuffix/i })).toBeInTheDocument();
  });

  it('location should be displayed as a link', () => {
    const { getByText } = renderLinkedHoldingDetails();

    const location = getByText('permanentLocationName > callNumberPrefix callNumber callNumberSuffix');

    expect(location.href).toContain('/inventory/view/instanceId/holdingsRecordId');
  });
});
