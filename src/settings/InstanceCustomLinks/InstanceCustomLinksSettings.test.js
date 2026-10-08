import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import {
  combineReducers,
  createStore,
} from 'redux';
import { reducer as formReducer } from 'redux-form';

import {
  screen,
  waitFor,
  within,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import { runAxeTest } from '@folio/stripes-testing';

import { Paneset } from '@folio/stripes/components';
import {
  CalloutContext,
  useStripes,
} from '@folio/stripes/core';

import {
  renderWithIntl,
  translationsProperties,
} from '../../../test/jest/helpers';
import buildStripes from '../../../test/jest/__mock__/stripesCore.mock';

import { InstanceCustomLinksSettings } from './InstanceCustomLinksSettings';

jest.unmock('@folio/stripes/components');
jest.unmock('@folio/stripes/smart-components');

const sendCallout = jest.fn();
const POST = jest.fn();
const validValues = { name: 'Foo', linkText: 'Bar', link: 'https://example.com' };

const buildRecords = (count) => Array.from({ length: count }, (_, i) => ({
  id: `link-${i}`,
  name: `Link name ${i}`,
  linkText: `Link text ${i}`,
  link: `https://example.com/${i}`,
  source: 'local',
  show: true,
}));

const renderInstanceCustomLinksSettings = ({ records = [], hasPerm = true } = {}) => {
  const mutator = {
    values: { POST, PUT: jest.fn(), DELETE: jest.fn() },
    activeRecord: { update: jest.fn() },
    updaterIds: { replace: jest.fn() },
  };

  useStripes.mockReturnValue(buildStripes({
    hasPerm: () => hasPerm,
    connect: Component => props => (
      <Component
        resources={{ values: { records, isPending: false }, updaters: { records: [] } }}
        mutator={mutator}
        {...props}
      />
    ),
  }));

  return renderWithIntl(
    <MemoryRouter>
      <Paneset>
        <Provider store={createStore(combineReducers({ form: formReducer }))}>
          <CalloutContext.Provider value={{ sendCallout }}>
            <InstanceCustomLinksSettings
              resources={{ instanceCustomLinksList: { records } }}
            />
          </CalloutContext.Provider>
        </Provider>
      </Paneset>
    </MemoryRouter>,
    translationsProperties
  );
};

const getNewButton = () => screen.queryByRole('button', { name: /new/i });

const openNewRow = async () => {
  await userEvent.click(await screen.findByRole('button', { name: /new/i }));
};

const fillRow = async ({ name, linkText, link }) => {
  const [nameInput, linkTextInput, linkInput] = await screen.findAllByRole('textbox');

  // Fields only show errors once touched, so focus every field even when leaving it empty.
  for (const [input, value] of [[nameInput, name], [linkTextInput, linkText], [linkInput, link]]) {
    await userEvent.click(input);
    if (value) await userEvent.paste(value);
  }
};

const clickSave = () => userEvent.click(screen.getByRole('button', { name: /save/i }));

const rejectWith422 = (errors) => POST.mockRejectedValue({
  status: 422,
  json: () => Promise.resolve({ errors }),
});

describe('InstanceCustomLinksSettings', () => {
  beforeEach(() => {
    sendCallout.mockClear();
    POST.mockReset();
  });

  describe('accessibility', () => {
    it('should render with no axe errors', async () => {
      const { container } = renderInstanceCustomLinksSettings({ records: buildRecords(2) });

      await screen.findByText('Link name 0');
      await runAxeTest({
        rootNode: container,
      });
    });

    it('should render with no axe errors while creating a link', async () => {
      const { container } = renderInstanceCustomLinksSettings({ records: buildRecords(2) });

      await openNewRow();
      await runAxeTest({
        rootNode: container,
      });
    });
  });

  describe('list of existing links', () => {
    it('shows each link\'s name, text and URL', async () => {
      renderInstanceCustomLinksSettings({ records: buildRecords(2) });

      expect(await screen.findByText('Link name 0')).toBeInTheDocument();
      expect(screen.getByText('Link text 1')).toBeInTheDocument();
      expect(screen.getByText('https://example.com/1')).toBeInTheDocument();
    });

    it('shows a disabled checkbox reflecting each link\'s show value', async () => {
      const [shown, hidden] = buildRecords(2);

      renderInstanceCustomLinksSettings({ records: [shown, { ...hidden, show: false }] });

      const shownRow = (await screen.findByText(shown.name)).closest('[role="row"]');
      const hiddenRow = screen.getByText(hidden.name).closest('[role="row"]');

      expect(within(shownRow).getByRole('checkbox', { name: 'Show' })).toBeChecked();
      expect(within(shownRow).getByRole('checkbox')).toBeDisabled();
      expect(within(hiddenRow).getByRole('checkbox')).not.toBeChecked();
    });
  });

  describe('new link row', () => {
    it('has an editable "Show" checkbox that is checked by default', async () => {
      renderInstanceCustomLinksSettings();
      await openNewRow();

      const checkbox = await screen.findByRole('checkbox', { name: 'Show' });

      expect(checkbox).toBeChecked();
      expect(checkbox).toBeEnabled();
    });

    it('submits the show value as unchecked when the user clears it', async () => {
      POST.mockResolvedValue({});
      renderInstanceCustomLinksSettings();
      await openNewRow();
      await fillRow(validValues);
      await userEvent.click(screen.getByRole('checkbox', { name: 'Show' }));
      await clickSave();

      await waitFor(() => expect(POST).toHaveBeenCalledWith(expect.objectContaining({ show: false })));
    });
  });

  describe('create button', () => {
    it('is available when there are fewer than 10 links', async () => {
      renderInstanceCustomLinksSettings({ records: buildRecords(9) });

      await screen.findByText('Link name 0');

      expect(getNewButton()).toBeInTheDocument();
    });

    it('is hidden once there are 10 or more links', async () => {
      renderInstanceCustomLinksSettings({ records: buildRecords(10) });

      await screen.findByText('Link name 0');

      expect(getNewButton()).not.toBeInTheDocument();
    });

    it('is hidden when the user lacks permission to edit', async () => {
      renderInstanceCustomLinksSettings({ records: buildRecords(1), hasPerm: false });

      await screen.findByText('Link name 0');

      expect(getNewButton()).not.toBeInTheDocument();
    });
  });

  describe('client-side validation', () => {
    it('submits a valid item without errors or error callouts', async () => {
      POST.mockResolvedValue({});
      renderInstanceCustomLinksSettings();
      await openNewRow();
      await fillRow(validValues);
      await clickSave();

      await waitFor(() => expect(POST).toHaveBeenCalledWith(expect.objectContaining(validValues)));
      expect(sendCallout).not.toHaveBeenCalledWith(expect.objectContaining({ type: 'error' }));
    });

    it('asks for required values and does not submit when fields are empty', async () => {
      renderInstanceCustomLinksSettings();
      await openNewRow();
      await clickSave();

      expect(await screen.findByText('Please fill this in to continue')).toBeInTheDocument();
      expect(POST).not.toHaveBeenCalled();
    });

    it.each([
      ['link text is empty', { linkText: '' }, 'Link text is required.'],
      ['link is empty', { link: '' }, 'Link is required.'],
      ['name is over 150 characters', { name: 'a'.repeat(151) }, 'Name cannot be more than 150 characters.'],
      ['link text is over 40 characters', { linkText: 'a'.repeat(41) }, 'Link text cannot be more than 40 characters.'],
      ['link text is only whitespace', { linkText: '   ' }, 'Link cannot be a blank string.'],
      ['link has no http(s) protocol', { link: 'ftp://example.com' }, 'Link must be HTTP or HTTPS.'],
      ['link has an unknown parameter', { link: 'https://example.com/{{bogus}}' }, 'Link must contain a valid parameter when provided.'],
      ['link is over 1000 characters', { link: `https://${'a'.repeat(1000)}` }, 'Link cannot be more than 1000 characters.'],
    ])('rejects the item when %s', async (_description, override, message) => {
      renderInstanceCustomLinksSettings();
      await openNewRow();
      await fillRow({ ...validValues, ...override });
      await clickSave();

      expect(await screen.findByText(message)).toBeInTheDocument();
      expect(POST).not.toHaveBeenCalled();
    });

    it.each([
      ['http://example.com'],
      ['HTTPS://example.com'],
      ['https://example.com/{{UUID}}'],
      ['https://example.com/{{HRID}}'],
      ['https://example.com/{{indexTitle}}'],
    ])('accepts link %s', async (link) => {
      POST.mockResolvedValue({});
      renderInstanceCustomLinksSettings();
      await openNewRow();
      await fillRow({ ...validValues, link });
      await clickSave();

      await waitFor(() => expect(POST).toHaveBeenCalledWith(expect.objectContaining({ link })));
    });
  });

  describe('backend error responses', () => {
    const save = async () => {
      renderInstanceCustomLinksSettings();
      await openNewRow();
      await fillRow(validValues);
      await clickSave();
    };

    it.each([
      ['name', 'Error saving data. Name must be unique.'],
      ['linkText', 'Error saving data. Link text must be unique.'],
      ['link', 'Error saving data. Link must be unique.'],
    ])('shows a callout when %s is not unique', async (key, message) => {
      rejectWith422([{ code: 'unique', message: `${key} must be unique`, parameters: [{ key, value: 'x' }] }]);
      await save();

      await waitFor(() => expect(sendCallout).toHaveBeenCalledTimes(1));

      const [{ type, message: content }] = sendCallout.mock.calls[0];
      const { container } = renderWithIntl(content, translationsProperties);

      expect(type).toBe('error');
      expect(container).toHaveTextContent(message);
    });

    it('shows the server message with the field name for other errors tied to a field', async () => {
      rejectWith422([{ code: 'other', message: 'Something went wrong', parameters: [{ key: 'name', value: 'x' }] }]);
      await save();

      await waitFor(() => expect(sendCallout).toHaveBeenCalledWith({ type: 'error', message: 'Something went wrong (name)' }));
    });

    it('shows the server message as-is for errors not tied to a field', async () => {
      rejectWith422([{ code: 'other', message: 'Something went wrong' }]);
      await save();

      await waitFor(() => expect(sendCallout).toHaveBeenCalledWith({ type: 'error', message: 'Something went wrong' }));
    });

    it('shows one callout per error in the response', async () => {
      rejectWith422([
        { code: 'other', message: 'First problem' },
        { code: 'other', message: 'Second problem' },
      ]);
      await save();

      await waitFor(() => expect(sendCallout).toHaveBeenCalledTimes(2));
    });
  });
});
