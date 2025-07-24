import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import '../../../../../../test/jest/__mock__';
import renderWithIntl from '../../../../../../test/jest/helpers/renderWithIntl';

import DescriptiveFormatsList from './DescriptiveFormatsList';

const formats = [
  'format1',
  'format2',
];

const resourceFormats = [
  {
    id: 'format1',
    name: 'name1',
    code: 'Code1',
    source: 'Source1',
  },
  {
    id: 'format2',
    name: 'name2',
    code: 'Code2',
    source: 'Source2',
  },
];

const props = {
  formats,
  resourceFormats,
};

const renderDescriptiveFormatsList = () => (
  renderWithIntl(
    <Router>
      <DescriptiveFormatsList {...props} />
    </Router>
  )
);

describe('DescriptiveFormatsList', () => {
  it('Should render DescriptiveFormatsList', () => {
    const { getByText } = renderDescriptiveFormatsList();
    const formatCategory = getByText('ui-inventory.formatCategory');
    const formatTerm = getByText('ui-inventory.formatTerm');
    const formatCode = getByText('ui-inventory.formatCode');
    const formatSource = getByText('ui-inventory.formatSource');
    expect(formatCategory).toBeInTheDocument();
    expect(formatTerm).toBeInTheDocument();
    expect(formatCode).toBeInTheDocument();
    expect(formatSource).toBeInTheDocument();
  });
});
