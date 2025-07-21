import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

import '../../../../../../test/jest/__mock__';
import renderWithIntl from '../../../../../../test/jest/helpers/renderWithIntl';

import InstanceDescriptiveView from './InstanceDescriptiveView';

const resourceTypes = [{
  id: 'instanceTypeId',
  name: 'Resource Type Name',
  code: 'Resource Type Code',
  source: 'Resource Type Source',
}];

const instanceDateTypes = [{
  id: 'instanceDateType',
  name: 'Test Date Type',
}];

const natureOfContentTerms = [{
  id: 'natureOfContentTermId1',
  name: 'Nature of Content Term Name 1',
}];

const resourceFormats = [{
  id: 'formatId1',
  name: 'Format Name 1',
}];

const instance = {
  publication: [{
    place: 'London',
    publisherName: 'Publisher Name',
    dateOfPublication: '2021',
  }],
  editions: ['Edition 1'],
  physicalDescriptions: ['Physical Description 1'],
  instanceTypeId: 'instanceTypeId',
  natureOfContentTermIds: ['natureOfContentTermId1'],
  instanceFormatIds: ['formatId1'],
  languages: [{
    languageId: 'languageId1',
    name: 'English',
  }],
  publicationFrequency: ['Publication Frequency 1'],
  publicationRange: ['Publication Range 1'],
  dates: {
    dateTypeId: 'instanceDateType',
    date1: '1234',
    date2: '1235',
  },
};

const props = {
  id: 'descriptive-data',
  instance,
  resourceTypes,
  resourceFormats,
  natureOfContentTerms,
  instanceDateTypes,
};

const renderInstanceDescriptiveView = () => (
  renderWithIntl(
    <Router>
      <InstanceDescriptiveView {...props} />
    </Router>
  )
);

describe('InstanceDescriptiveView', () => {
  it('render and click descriptiveData button', () => {
    const { getByText } = renderInstanceDescriptiveView();
    const databutton = getByText(/ui-inventory.descriptiveData/i);
    userEvent.click(databutton);
    expect(getByText).toBeDefined();
  });

  it('should render Date Type, Date1 and Date2', () => {
    const { getByText } = renderInstanceDescriptiveView();

    expect(getByText('Test Date Type')).toBeInTheDocument();
    expect(getByText('1234')).toBeInTheDocument();
    expect(getByText('1235')).toBeInTheDocument();
  });
});
