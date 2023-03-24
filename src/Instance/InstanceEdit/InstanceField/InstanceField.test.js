import React from 'react';
import { screen } from '@testing-library/react';
import { noop, keyBy } from 'lodash';
import { BrowserRouter as Router } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import '../../../../test/jest/__mock__';

import { StripesContext } from '@folio/stripes-core/src/StripesContext';
import stripesFinalForm from '@folio/stripes/final-form';

import { DataContext } from '../../../contexts';
import {
  renderWithIntl,
  translationsProperties,
  stripesStub,
} from '../../../../test/jest/helpers';
import {
  identifierTypes,
  instanceRelationshipTypes,
  subInstances,
} from '../../../../test/fixtures';
import InstanceField from './InstanceField';

const referenceData = {
  contributorTypes: [],
  identifierTypes,
  identifierTypesById: keyBy(identifierTypes, 'id'),
  identifierTypesByName: keyBy(identifierTypes, 'name'),
  instanceRelationshipTypes,
  instanceRelationshipTypesById: keyBy(identifierTypes, 'id'),
  instanceFormats: [],
  modesOfIssuance: [],
  natureOfContentTerms: [],
  tagsRecords: [],
  field: 'xyz',
  fields: { id:113, lable:'abc' },
  titleIdKey: 'its me',
  update: true,
  value:'hello',
};

const mockFields = {
  update: jest.fn(),
  value: [
    {
      id: '1',
      hrid: '12345',
      title: 'Test Title',
      identifiers: [],
      publication: [
        {
          publisher: 'Test Publisher',
          dateOfPublication: '2022-01-01',
        },
      ],
    },
  ],
};

const mockField = 'instanceField';

const mockIndex = 0;

const mockTitleIdKey = 'titleId';

const mockIsDisabled = false;

const mockRelationshipTypes = [{ id: 1, label: 'Type 1' }, { id: 2, label: 'Type 2' }];

const Form = stripesFinalForm({})(({ children }) => <form>{children}</form>);

const InstanceFieldSetup = () => (
  <Router>
    <StripesContext.Provider value={stripesStub}>
      <DataContext.Provider value={referenceData}>
        <Form onSubmit={noop} initialValues={{ childInstances: subInstances }}>
          <InstanceField
            relationshipTypes={mockRelationshipTypes}
            field={mockField}
            fields={mockFields}
            index={mockIndex}
            titleIdKey={mockTitleIdKey}
            isDisabled={mockIsDisabled}
          />
        </Form>
      </DataContext.Provider>
    </StripesContext.Provider>
  </Router>
);

describe('InstanceField', () => {
  beforeEach(async () => {
    await act(async () => {
      renderWithIntl(<InstanceFieldSetup />, translationsProperties);
    });
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('renders instance HRID', () => {
    const instanceHRID = screen.getByText('Instance HRID');
    const instanceHRIDValue = screen.getByText('12345');
    expect(instanceHRID).toBeInTheDocument();
    expect(instanceHRIDValue).toBeInTheDocument();
  });
  it('renders publisher', () => {
    const publisher = screen.getByText('Publisher');
    const publisherValue = screen.getByText('Test Publisher');
    expect(publisher).toBeInTheDocument();
    expect(publisherValue).toBeInTheDocument();
  });
  it('renders publication date', () => {
    const publicationDate = screen.getByText('Publication date');
    const publicationDateValue = screen.getByText('2022-01-01');
    expect(publicationDate).toBeInTheDocument();
    expect(publicationDateValue).toBeInTheDocument();
  });
  it('renders ISBN', () => {
    const isbn = screen.getByText('ISBN');
    expect(isbn).toBeInTheDocument();
  });
  it('renders ISSN', () => {
    const issn = screen.getByText('ISSN');
    expect(issn).toBeInTheDocument();
  });
  it('renders type of relation', () => {
    const typeOfRelation = screen.getByText('Type of relation');
    const typeOfRelationOption = screen.getByText('Select type');
    expect(typeOfRelation).toBeInTheDocument();
    expect(typeOfRelationOption).toBeInTheDocument();
  });
});
