import { MemoryRouter } from 'react-router-dom';

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

  describe('getCustomErrorMessages', () => {
    it('shows no callouts when response contains no errors', () => {
      const sendCallout = jest.fn();
      renderInstanceCustomLinksSettings({}, { sendCallout });
      const { getCustomErrorMessages } = getLatestControlledVocabProps();

      getCustomErrorMessages([]);

      expect(sendCallout).not.toHaveBeenCalled();
    });

    it('shows the generic case callout when response contains a field-specific unique error for an unrecognized field', () => {
      const sendCallout = jest.fn();
      renderInstanceCustomLinksSettings({}, { sendCallout });
      const { getCustomErrorMessages } = getLatestControlledVocabProps();

      getCustomErrorMessages([{
        code: 'unique',
        parameters: [{ key: 'description', value: 'Foo' }],
        message: 'description must be unique',
      }]);

      expect(sendCallout).toHaveBeenCalledTimes(1);
      expect(sendCallout).toHaveBeenCalledWith({ type: 'error', message: 'description must be unique (description)' });
    });

    it('shows the callout for name uniqueness error', () => {
      const sendCallout = jest.fn();
      renderInstanceCustomLinksSettings({}, { sendCallout });
      const { getCustomErrorMessages } = getLatestControlledVocabProps();

      getCustomErrorMessages([{
        code: 'unique',
        parameters: [{ key: 'name', value: 'Foo' }],
        message: 'name must be unique',
      }]);

      expect(sendCallout).toHaveBeenCalledTimes(1);
      const { type, message } = sendCallout.mock.calls[0][0];
      expect(type).toBe('error');
      expect(message.props.id).toBe('ui-inventory.instanceCustomLinks.error.nameUnique');
    });

    it('shows the callout for linkText uniqueness error', () => {
      const sendCallout = jest.fn();
      renderInstanceCustomLinksSettings({}, { sendCallout });
      const { getCustomErrorMessages } = getLatestControlledVocabProps();

      getCustomErrorMessages([{
        code: 'unique',
        parameters: [{ key: 'linkText', value: 'Bar' }],
        message: 'linkText must be unique',
      }]);

      expect(sendCallout).toHaveBeenCalledTimes(1);
      const { type, message } = sendCallout.mock.calls[0][0];
      expect(type).toBe('error');
      expect(message.props.id).toBe('ui-inventory.instanceCustomLinks.error.linkTextUnique');
    });

    it('shows the callout for link uniqueness error', () => {
      const sendCallout = jest.fn();
      renderInstanceCustomLinksSettings({}, { sendCallout });
      const { getCustomErrorMessages } = getLatestControlledVocabProps();

      getCustomErrorMessages([{
        code: 'unique',
        parameters: [{ key: 'link', value: 'https://example.com' }],
        message: 'link must be unique',
      }]);

      expect(sendCallout).toHaveBeenCalledTimes(1);
      const { type, message } = sendCallout.mock.calls[0][0];
      expect(type).toBe('error');
      expect(message.props.id).toBe('ui-inventory.instanceCustomLinks.error.linkUnique');
    });

    it('shows the callout for a generic, non-uniqueness related error', () => {
      const sendCallout = jest.fn();
      renderInstanceCustomLinksSettings({}, { sendCallout });
      const { getCustomErrorMessages } = getLatestControlledVocabProps();

      getCustomErrorMessages([{
        code: 'genericError',
        message: 'Something went wrong',
      }]);

      expect(sendCallout).toHaveBeenCalledTimes(1);
      expect(sendCallout).toHaveBeenCalledWith({ type: 'error', message: 'Something went wrong' });
    });

    it('shows the callout for a generic, non-uniqueness related error unrelated to any field', () => {
      const sendCallout = jest.fn();
      renderInstanceCustomLinksSettings({}, { sendCallout });
      const { getCustomErrorMessages } = getLatestControlledVocabProps();

      getCustomErrorMessages([{
        code: 'genericError',
        parameters: [],
        message: 'Something went wrong',
      }]);

      expect(sendCallout).toHaveBeenCalledTimes(1);
      expect(sendCallout).toHaveBeenCalledWith({ type: 'error', message: 'Something went wrong' });
    });

    it('shows the callout for a generic, non-uniqueness related error including the relevant field', () => {
      const sendCallout = jest.fn();
      renderInstanceCustomLinksSettings({}, { sendCallout });
      const { getCustomErrorMessages } = getLatestControlledVocabProps();

      getCustomErrorMessages([{
        code: 'genericError',
        parameters: [{ key: 'name', value: 'Foo' }],
        message: 'Something went wrong',
      }]);

      expect(sendCallout).toHaveBeenCalledTimes(1);
      expect(sendCallout).toHaveBeenCalledWith({ type: 'error', message: 'Something went wrong (name)' });
    });
  });
});
