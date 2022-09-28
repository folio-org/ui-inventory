import React from 'react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import '../../../../test/jest/__mock__';

import renderWithIntl from '../../../../test/jest/helpers/renderWithIntl';
import translationsProperties from '../../../../test/jest/helpers/translationsProperties';
import InstanceContributorsView from './InstanceContributorsView';

const contributors = [{
  authorityId: null,
  contributorNameTypeId: '2b94c631-fca9-4892-a730-03ee529ffe2a',
  contributorTypeId: null,
  contributorTypeText: null,
  name: 'Perich, Tristan',
  primary: true,
}];

const contributorNameTypes = [{
  id: '2b94c631-fca9-4892-a730-03ee529ffe2a',
  name: 'Personal name',
  ordering: '1',
}];

const history = createMemoryHistory();

const renderComponent = (props = {}) => renderWithIntl(
  <Router history={history}>
    <InstanceContributorsView
      id="fakeId"
      contributors={contributors}
      contributorTypes={[]}
      contributorNameTypes={contributorNameTypes}
      source="FOLIO"
      segment="holdings"
      {...props}
    />
  </Router>,
  translationsProperties,
);

describe('InstanceContributorsView', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('when Instance record with source = MARC is linked to an authority record', () => {
    it('should display the MARC authority app icon', () => {
      const { getByTestId } = renderComponent({
        contributors: [{
          ...contributors[0],
          authorityId: 'fakeId',
        }],
        source: 'MARC',
        segment: null,
      });

      expect(getByTestId('authority-app-link')).toBeVisible();
    });
  });
});
