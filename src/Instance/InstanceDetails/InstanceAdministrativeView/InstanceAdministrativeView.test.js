import React from 'react';
import { screen } from '@testing-library/react';

import '../../../../test/jest/__mock__';

import renderWithIntl from '../../../../test/jest/helpers/renderWithIntl';
import translationsProperties from '../../../../test/jest/helpers/translationsProperties';
import { instances as instancesFixture } from '../../../../test/fixtures/instances';
import InstanceAdministrativeView from './InstanceAdministrativeView';

const InstanceAdministrativeViewSetup = ({
  instance = instancesFixture[0],
} = {}) => (
  <InstanceAdministrativeView
    id={instance.id}
    instance={{ ...instance, metadata: null, discoverySuppress: true }}
  />
);

describe('InstanceAdministrativeView', () => {
  describe('rendering warnings', () => {
    beforeEach(() => {
      renderWithIntl(
        <InstanceAdministrativeViewSetup />,
        translationsProperties
      );
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should show supress from discovery warning', () => {
      expect(screen.getByText('ui-inventory.discoverySuppressed')).toBeInTheDocument();
    });
  });
});
