import '../../../test/jest/__mock__';
import PropTypes from 'prop-types';
import { MemoryRouter } from 'react-router-dom';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { QueryClient, QueryClientProvider } from 'react-query';
import stripesFinalForm from '@folio/stripes/final-form';
import { useOkapiKy } from '@folio/stripes/core';
import renderWithRouter from '../../../test/jest/helpers/renderWithRouter';
import renderWithIntl from '../../../test/jest/helpers/renderWithIntl';

import translationsProperties from '../../../test/jest/helpers/translationsProperties';
import { instance } from '../../../test/fixtures/instance';
import {
  useInstanceQuery,
  useHolding,
} from '../../common/hooks';

import CreateItem from './CreateItem';

jest.mock('../../edit/items/ItemForm', () => jest.fn(({ onSubmit = () => Promise.resolve(), onCancel = () => Promise.resolve() }) => (
  <div>
    <button type="button" onClick={onSubmit}>submit</button>
    <button type="button" onClick={onCancel}>cancel</button>
  </div>
)));

jest.mock('../../hooks/useCallout', () => jest.fn().mockReturnValue({ sendCallout: jest.fn() }));

jest.mock('../../common/hooks', () => ({
  ...jest.requireActual('../../common/hooks'),
  useItemMutation: jest.fn().mockReturnValue({
    mutateItem: jest.fn()
  }),
  useInstanceQuery: jest.fn().mockReturnValue({ instance: {}, isLoading: false }),
  useHolding: jest.fn().mockReturnValue({ holding: {}, isLoading: false }),
}));

const defaultProps = {
  instanceId: instance.id,
  holdingId: 'holdingId',
  referenceData: {},
};

const queryClient = new QueryClient();

const onSubmit = jest.fn();
const administrativeNotes = { id:'12', value:'qw' };

const Form = ({ handleSubmit }) => (
  <form onSubmit={handleSubmit}>
    <CreateItem initialValues={{ administrativeNotes }} {...defaultProps} />
  </form>
);

Form.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
};

const WrappedForm = stripesFinalForm({
  isLoading: false,
})(Form);

const renderCreateItem = () => renderWithIntl(
  renderWithRouter(
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>
        <WrappedForm onSubmit={onSubmit} />
      </QueryClientProvider>
    </MemoryRouter>
  ),
  translationsProperties,
);

describe('Create Item', () => {
  const hrid = { id:'123' };
  beforeEach(() => {
    useInstanceQuery.mockClear();
    useHolding.mockClear();
  });
  useOkapiKy.mockClear().mockReturnValue({
    post: () => ({
      json: () => (({ hrid })),
    }),
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should click Submit button', () => {
    renderCreateItem();
    const submitBtn = screen.getByRole('button', { name: 'submit' });
    expect(submitBtn).toBeInTheDocument();
    userEvent.click(submitBtn);
  });
  it('should cancel', () => {
    renderCreateItem();
    const cancelBtn = screen.getByRole('button', { name: 'cancel' });
    expect(cancelBtn).toBeInTheDocument();
    userEvent.click(cancelBtn);
  });

  it('should render LoadingView if page is loading', () => {
    useInstanceQuery.mockReturnValue({ isLoading: true });

    renderCreateItem();

    expect(screen.getByText('LoadingView')).toBeInTheDocument();
  });
});
