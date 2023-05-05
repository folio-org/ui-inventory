import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import PropTypes from 'prop-types';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import '../../../test/jest/__mock__';
import stripesFinalForm from '@folio/stripes/final-form';
import renderWithRouter from '../../../test/jest/helpers/renderWithRouter';
import renderWithIntl from '../../../test/jest/helpers/renderWithIntl';
import translationsProperties from '../../../test/jest/helpers/translationsProperties';

import HoldingsForm from './HoldingsForm';

jest.mock('../common', () => ({
  LocationSelectionWithCheck: () => <div>LocationSelection</div>,
}));

const mockInitialValues = {
  holdingsNoteTypeId: 'holdingsNoteTypeId',
  callNumberTypeId: 'callNumberTypeId',
  holdingsTypeId: 'holdingsTypeId',
  sourceId: 'MARC',
  statisticalCodeId: 'statisticalCodeId',
  illPolicyId: 'illPolicyId',
  id: 'id',
  permanentLocationId: 'permanentLocationId',
};

const mockOnCancel = jest.fn();

const mockInstance = {};

const mockReferenceTables = {
  holdingsNoteTypes: [
    { id: '1', name: 'Note Type 1' },
    { id: '2', name: 'Note Type 2' },
  ],
  callNumberTypes: [
    { id: '1', name: 'Call Number Type 1' },
    { id: '2', name: 'Call Number Type 2' },
  ],
  holdingsTypes: [
    { id: '1', name: 'Holdings Type 1' },
    { id: '2', name: 'Holdings Type 2' },
  ],
  holdingsSources: [
    { id: '1', name: 'Holdings Source 1' },
    { id: '2', name: 'Holdings Source 2' },
  ],
  holdingsSourcesByName: {
    FOLIO: { name: 'Holdings Source FOLIO' },
  },
  statisticalCodes: [
    { id: '1', code: 'Code 1', name: 'Statistical Code 1', statisticalCodeTypeId: '1' },
    { id: '2', code: 'Code 2', name: 'Statistical Code 2', statisticalCodeTypeId: '2' },
  ],
  statisticalCodeTypes: [
    { id: '1', name: 'Statistical Code Type 1' },
    { id: '2', name: 'Statistical Code Type 2' },
  ],
  illPolicies: [
    { id: '1', name: 'ILL Policy 1' },
    { id: '2', name: 'ILL Policy 2' },
  ],
  electronicAccessRelationships: [
    { id: '1', name: 'electronic Access Relationships 1' },
    { id: '2', name: 'electronic Access Relationships 2' },
  ],
};

const mockResources = {
  holdingsBlockedFields: {
    hasLoaded: true,
    records: [
      {
        blockedFields: ['field1', 'field2'],
      },
    ],
  },
};

const mockItemCount = 0;
const goToMock = jest.fn();

const httpErrorMock = null;

const onSubmit = jest.fn();
const handleSubmitMock = jest.fn();

const Form = ({ handleSubmit }) => (
  <form onSubmit={handleSubmit}>
    <HoldingsForm
      handleSubmit={handleSubmitMock}
      pristine={false}
      submitting={false}
      copy={false}
      initialValues={mockInitialValues}
      onSubmit={onSubmit}
      onCancel={mockOnCancel}
      instance={mockInstance}
      location={{ state: 'someState' }}
      referenceTables={mockReferenceTables}
      itemCount={mockItemCount}
      isMARCRecord
      resources={mockResources}
      goTo={goToMock}
      httpError={httpErrorMock}
    />
  </form>
);

Form.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
};

const WrappedForm = stripesFinalForm({
  navigationCheck: true,
  enableReinitialize: false,
})(Form);

const renderHoldingsForm = () => renderWithIntl(
  renderWithRouter(<WrappedForm onSubmit={onSubmit} />),
  translationsProperties,
);

describe('HoldingsForm', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  beforeEach(() => {
    renderHoldingsForm();
  });
  it('click Add note Button', () => {
    const notesButton = screen.getByRole('button', { name: 'Add note' });
    expect(notesButton).toBeInTheDocument();
    userEvent.click(notesButton);
    const CancelButton = screen.getByRole('button', { name: 'Cancel' });
    expect(CancelButton).toBeInTheDocument();
    userEvent.click(CancelButton);
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });
});

describe('changing props for HoldingsForm', () => {
  const onCancelMock = jest.fn();
  const onSubmitMock = jest.fn();
  const referenceTablesMock = {
    holdingsSourcesByName: { MARC: { name: 'MARC' } },
    electronicAccessRelationships: [],
    permanentLocationId:  [{ id: 'permanentLocationId', name: 'permanentLocationId' }],
  };
  const defaultProps = {
    handleSubmit: handleSubmitMock,
    onCancel: onCancelMock,
    onSubmit: onSubmitMock,
    pristine: true,
    submitting: false,
    copy: false,
    initialValues: {},
    instance: {},
    isMARCRecord: false,
    location: { state: '' },
    referenceTables: referenceTablesMock,
    resources: { holdingsBlockedFields: { records: [] } },
    stripes: { connect: jest.fn() },
    form: { change: jest.fn() },
    goTo: jest.fn(),
    httpError: null,
  };
  const HoldingsFormSetup = () => (
    <Router>
      <HoldingsForm {...defaultProps} />
    </Router>
  );
  const newRenderHoldingsForm = (props = {}) => renderWithIntl(
    <HoldingsFormSetup {...props} />,
    translationsProperties
  );
  beforeEach(() => {
    handleSubmitMock.mockClear();
    onCancelMock.mockClear();
    newRenderHoldingsForm();
  });
  it('render Holdings call number', () => {
    expect(screen.getByText(/Holdings call number/i)).toBeInTheDocument();
  });
});
