import React from 'react';
import { render, cleanup, fireEvent, screen } from '@testing-library/react';
import { noop } from 'lodash';

import '@folio/stripes-acq-components/test/jest/__mock__';

import TagsFilter from './TagsFilter';

const TAGS = [{
  'id': 'd3c8b511-41e7-422e-a483-18778d0596e5',
  'label': 'important',
  'metadata': {
    'createdDate': '2020-11-23T03:21:03.915+00:00',
    'updatedDate': '2020-11-23T03:21:03.915+00:00'
  }
}, {
  'id': 'b822d5a8-1750-4b5f-92bd-9fc73a05ddda',
  'label': 'new',
  'description': 'new',
  'metadata': {
    'createdDate': '2020-11-23T11:10:48.413+00:00',
    'createdByUserId': 'f40d6d27-8af3-5718-9eb1-5046622e5f8c',
    'updatedDate': '2020-11-23T11:10:48.413+00:00',
    'updatedByUserId': 'f40d6d27-8af3-5718-9eb1-5046622e5f8c'
  }
}, {
  'id': 'c3799dc5-500b-44dd-8e17-2f2354cc43e3',
  'label': 'urgent',
  'description': 'Requires urgent attention',
  'metadata': {
    'createdDate': '2020-11-23T03:21:03.894+00:00',
    'updatedDate': '2020-11-23T03:21:03.894+00:00'
  }
}];

const filterAccordionTitle = 'ui-inventory.filter.tags';

const renderFilter = (tagsRecords, selectedValues, onChange = noop, onClear = noop) => (render(
  <TagsFilter
    onChange={onChange}
    onClear={onClear}
    selectedValues={selectedValues}
    tagsRecords={tagsRecords}
  />,
));

describe('TagsFilter component', () => {
  afterEach(cleanup);

  it('should display filter without tags', () => {
    renderFilter();
    expect(screen.getByText(filterAccordionTitle)).toBeDefined();
  });

  it('should display filter accordion with tags', () => {
    renderFilter(TAGS);
    expect(screen.getByText(filterAccordionTitle)).toBeDefined();
    expect(screen.getByText(TAGS[0].label)).toBeDefined();
  });

  it('should display filter accordion with tags and selected values', () => {
    renderFilter(TAGS, ['urgent']);
    expect(screen.getByText('new')).toBeDefined();
  });

  it('should call onChange handler if new tag is clicked', () => {
    const onChangeFilter = jest.fn();

    renderFilter(TAGS, undefined, onChangeFilter);
    fireEvent.click(screen.getByText('new'));
    expect(onChangeFilter).toHaveBeenCalled();
  });

  it('should call onChange handler if selected tag is clicked', () => {
    const onChangeFilter = jest.fn();

    renderFilter(TAGS, ['urgent'], onChangeFilter);
    fireEvent.click(screen.getAllByText('urgent')[1]); // last element is the option in the list
    expect(onChangeFilter).toHaveBeenCalled();
  });

  it('should call onClear handler if clear btn is clicked', () => {
    const onClear = jest.fn();

    renderFilter(TAGS, ['urgent'], undefined, onClear);
    fireEvent.click(screen.getAllByLabelText('Clear selected filters for "ui-inventory.filter.tags"')[0]);
    expect(onClear).toHaveBeenCalled();
  });

  it('should display filter accordion without tags and selected values', () => {
    renderFilter(undefined, ['urgent']);
    expect(screen.getByText('stripes-components.multiSelection.defaultEmptyMessage')).toBeDefined();
  });
});
