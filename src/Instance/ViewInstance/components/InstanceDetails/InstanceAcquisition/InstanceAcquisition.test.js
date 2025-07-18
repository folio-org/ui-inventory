import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import { useStripes } from '@folio/stripes/core';
import { screen } from '@folio/jest-config-stripes/testing-library/react';

import '../../../../../../test/jest/__mock__';
import {
  renderWithIntl,
  translationsProperties,
} from '../../../../../../test/jest/helpers';

import { resultData, line } from './fixtures';
import InstanceAcquisition from './InstanceAcquisition';
import useInstanceAcquisition from './useInstanceAcquisition';

import * as utils from '../../../../../utils';

jest.mock('./useInstanceAcquisition', () => jest.fn());

const spyOnIsUserInConsortiumMode = jest.spyOn(utils, 'isUserInConsortiumMode');

const renderInstanceAcquisition = (props = {}) => (
  renderWithIntl(
    <Router>
      <InstanceAcquisition
        instanceId="instanceId"
        accordionId="accordionId"
        {...props}
      />
    </Router>,
    translationsProperties
  )
);

describe('InstanceAcquisition', () => {
  beforeEach(() => {
    useInstanceAcquisition.mockClear().mockReturnValue({ instanceAcquisition: resultData });
  });

  describe('when user is non-consortial tenant', () => {
    it('should display acquisition accordion and fetched instance acquisition data', () => {
      spyOnIsUserInConsortiumMode.mockReturnValue(false);
      useStripes.mockClear().mockReturnValue({
        hasInterface: () => true,
        okapi: { tenant: 'diku' },
        user: { user: {} },
      });

      const { container } = renderInstanceAcquisition({ instanceId: 'instanceId' });

      expect(container.querySelector('#accordionId')).toBeInTheDocument();
      expect(screen.getByText(line.poLineNumber)).toBeInTheDocument();
    });
  });

  describe('when user is in central tenant', () => {
    it('should display acquisition accordion and fetched instance acquisition data', () => {
      spyOnIsUserInConsortiumMode.mockReturnValue(true);
      useStripes.mockClear().mockReturnValue({
        hasInterface: () => true,
        okapi: { tenant: 'consortium' },
        user: { user: {
          consortium: { centralTenantId: 'consortium' },
          tenants: [{
            id: 'consortium',
            name: 'Consortium',
          }],
        } },
      });

      const { container } = renderInstanceAcquisition({ instanceId: 'instanceId' });

      expect(container.querySelector('#accordionId')).toBeInTheDocument();
      expect(screen.getByText(line.poLineNumber)).toBeInTheDocument();
    });
  });

  describe('when user is in member tenant', () => {
    it('should display central and member tenant subaccordions with fetched instance acquisition data', () => {
      spyOnIsUserInConsortiumMode.mockReturnValue(true);
      useStripes.mockClear().mockReturnValue({
        hasInterface: () => true,
        okapi: { tenant: 'college' },
        user: { user: {
          consortium: { centralTenantId: 'consortium' },
          tenants: [{
            id: 'consortium',
            name: 'Consortium',
          }, {
            id: 'college',
            name: 'College',
          }],
        } },
      });

      const { container } = renderInstanceAcquisition({ instanceId: 'instanceId' });

      expect(container.querySelector('#accordionId')).toBeInTheDocument();
      expect(container.querySelector('#active-acquisition-accordion')).toBeInTheDocument();
      expect(screen.getAllByText(line.poLineNumber)[0]).toBeInTheDocument();

      expect(container.querySelector('#central-acquisition-accordion')).toBeInTheDocument();
      expect(screen.getAllByText(line.poLineNumber)[1]).toBeInTheDocument();
    });
  });
});
