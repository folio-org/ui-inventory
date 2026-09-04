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

      expect(validate({ name: 'Foo', linkText: 'Bar', baseUrl: 'https://example.com' })).toEqual({});
    });

    it('surfaces each field-level client-side validation error', () => {
      renderInstanceCustomLinksSettings();
      const { validate } = getLatestControlledVocabProps();

      const errors = validate({});

      expect(errors.name.props.id).toBe('ui-inventory.fillIn');
      expect(errors.linkText.props.id).toBe('ui-inventory.instanceCustomLink.error.linkTextRequired');
      expect(errors.baseUrl.props.id).toBe('ui-inventory.instanceCustomLink.error.baseUrlRequired');
    });
  });

  describe('mutator.entries', () => {
    const buildHttpError = (body) => ({ json: jest.fn().mockResolvedValue(body) });

    it('resolves and resets server errors on a successful POST', async () => {
      const post = jest.fn().mockResolvedValue({ id: '1' });

      renderInstanceCustomLinksSettings({ mutator: { entries: { POST: post, PUT: jest.fn() } } });
      const { mutator } = getLatestControlledVocabProps();

      await act(async () => {
        await expect(mutator.entries.POST({ name: 'Foo' })).resolves.toEqual({ id: '1' });
      });
    });

    it('resolves and resets server errors on a successful PUT', async () => {
      const put = jest.fn().mockResolvedValue({ id: '1' });

      renderInstanceCustomLinksSettings({ mutator: { entries: { POST: jest.fn(), PUT: put } } });
      const { mutator } = getLatestControlledVocabProps();

      await act(async () => {
        await expect(mutator.entries.PUT({ name: 'Foo' })).resolves.toEqual({ id: '1' });
      });
    });

    it('classifies a known field error, feeds it into validate(), and rethrows', async () => {
      const httpError = buildHttpError({
        errors: [
          { code: 'unique', parameters: [{ key: 'name', value: 'a'.repeat(150) }], message: 'Name must be unique' },
        ],
      });
      const post = jest.fn().mockRejectedValue(httpError);

      renderInstanceCustomLinksSettings({ mutator: { entries: { POST: post, PUT: jest.fn() } } });
      const { mutator } = getLatestControlledVocabProps();

      await act(async () => {
        await expect(mutator.entries.POST({ name: 'a'.repeat(150) })).rejects.toBe(httpError);
      });

      const { validate } = getLatestControlledVocabProps();

      expect(validate({ name: 'a'.repeat(150) }).name.props.id)
        .toBe('ui-inventory.instanceCustomLink.error.nameUnique');
    });

    it('lets a client-side validation error take precedence over a matching server error', async () => {
      const value = 'a'.repeat(151);
      const httpError = buildHttpError({
        errors: [{ code: 'unique', parameters: [{ key: 'name', value }], message: 'Name must be unique' }],
      });
      const post = jest.fn().mockRejectedValue(httpError);

      renderInstanceCustomLinksSettings({ mutator: { entries: { POST: post, PUT: jest.fn() } } });
      const { mutator } = getLatestControlledVocabProps();

      await act(async () => {
        await expect(mutator.entries.POST({ name: value })).rejects.toBe(httpError);
      });

      const { validate } = getLatestControlledVocabProps();

      expect(validate({ name: value }).name.props.id)
        .toBe('ui-inventory.instanceCustomLink.error.nameTooLong');
    });

    it('sends a callout for an unrecognized error without touching validation state', async () => {
      const httpError = buildHttpError({
        errors: [{ code: 'unexpected', message: 'Something went wrong' }],
      });
      const post = jest.fn().mockRejectedValue(httpError);
      const sendCallout = jest.fn();

      renderInstanceCustomLinksSettings(
        { mutator: { entries: { POST: post, PUT: jest.fn() } } },
        { sendCallout },
      );
      const { mutator } = getLatestControlledVocabProps();

      await act(async () => {
        await expect(mutator.entries.POST({ name: 'Foo', linkText: 'Bar', baseUrl: 'https://example.com' })).rejects.toBe(httpError);
      });

      expect(sendCallout).toHaveBeenCalledWith({ type: 'error', message: 'Something went wrong' });

      const { validate } = getLatestControlledVocabProps();

      expect(validate({ name: 'Foo', linkText: 'Bar', baseUrl: 'https://example.com' })).toEqual({});
    });
  });
});
