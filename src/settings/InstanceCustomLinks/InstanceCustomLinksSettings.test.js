import { MemoryRouter } from 'react-router-dom';
import { act } from '@folio/jest-config-stripes/testing-library/react';

import { runAxeTest } from '@folio/stripes-testing';
import { Paneset } from '@folio/stripes/components';
import { CalloutContext } from '@folio/stripes/core';
import { ControlledVocab } from '@folio/stripes/smart-components';

import {
  renderWithIntl,
  translationsProperties,
} from '../../../test/jest/helpers';

import buildStripes from '../../../test/jest/__mock__/stripesCore.mock';

import InstanceCustomLinksSettings from './InstanceCustomLinksSettings';

jest.mock('../../hooks', () => ({
  ...jest.requireActual('../../hooks'),
  useCallNumberTypesQuery: jest.fn(),
}));
jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useStripes: jest.fn().mockReturnValue({
    hasInterface: () => true,
    hasPerm: () => true,
    connect: component => component,
    user: {},
    okapi: {},
  }),
  useOkapiKy: jest.fn().mockReturnValue({
    get: jest.fn(),
    extend: jest.fn(),
  }),
  useUserTenantPermissions: jest.fn().mockReturnValue({
    userPermissions: [],
    isFetching: false,
  }),
}));

const defaultProps = {
  stripes: buildStripes(),
};

const renderInstanceCustomLinksSettings = (props = {}, { sendCallout } = {}) => renderWithIntl(
  <MemoryRouter>
    <Paneset>
      {sendCallout ? (
        <CalloutContext.Provider value={{ sendCallout }}>
          <InstanceCustomLinksSettings
            {...defaultProps}
            {...props}
          />
        </CalloutContext.Provider>
      ) : (
        <InstanceCustomLinksSettings
          {...defaultProps}
          {...props}
        />
      )}
    </Paneset>
  </MemoryRouter>,
  translationsProperties
);

const getLatestControlledVocabProps = () => {
  const { calls } = ControlledVocab.mock;

  return calls[calls.length - 1][0];
};

describe('InstanceCustomLinksSettings', () => {
  beforeEach(() => {
    ControlledVocab.mockClear();
  });

  it('should render with no axe errors', async () => {
    const { container } = renderInstanceCustomLinksSettings();

    await runAxeTest({
      rootNode: container,
    });
  });

  describe('hideCreateButton', () => {
    it('is false when there are fewer than 10 links', () => {
      renderInstanceCustomLinksSettings({
        resources: { instanceCustomLinksList: { records: new Array(9).fill({}) } },
      });

      expect(getLatestControlledVocabProps().hideCreateButton).toBe(false);
    });

    it('is true once there are 10 or more links', () => {
      renderInstanceCustomLinksSettings({
        resources: { instanceCustomLinksList: { records: new Array(10).fill({}) } },
      });

      expect(getLatestControlledVocabProps().hideCreateButton).toBe(true);
    });
  });

  describe('formatter.show', () => {
    it('renders a disabled checkbox reflecting the show value', () => {
      renderInstanceCustomLinksSettings();
      const { formatter } = getLatestControlledVocabProps();

      const { container } = renderWithIntl(formatter.show({ show: true }), translationsProperties);
      const checkbox = container.querySelector('input[type="checkbox"]');

      expect(checkbox).toBeChecked();
      expect(checkbox).toBeDisabled();
    });
  });

  describe('validate', () => {
    it('returns no errors for a fully valid item', () => {
      renderInstanceCustomLinksSettings();
      const { validate } = getLatestControlledVocabProps();

      expect(validate({ name: 'Foo', linkText: 'Bar', link: 'https://example.com' })).toEqual({});
    });

    it('surfaces each field-level client-side validation error', () => {
      renderInstanceCustomLinksSettings();
      const { validate } = getLatestControlledVocabProps();

      const errors = validate({});

      expect(errors.name.props.id).toBe('ui-inventory.fillIn');
      expect(errors.linkText.props.id).toBe('ui-inventory.instanceCustomLinks.error.linkTextRequired');
      expect(errors.link.props.id).toBe('ui-inventory.instanceCustomLinks.error.linkRequired');
    });
  });
});
