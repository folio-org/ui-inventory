import React from 'react';
import { render, screen, fireEvent } from '@folio/jest-config-stripes/testing-library/react';
import { useSearchValue } from '../../stores/facetsStore';
import '../../../test/jest/__mock__';
import CheckboxFacetList from './CheckboxFacetList';

jest.mock('../../stores/facetsStore', () => ({
  useSearchValue: jest.fn(),
}));

jest.mock('react-intl', () => {
  const intl = {
    formatMessage: ({ id }) => id,
  };

  return {
    ...jest.requireActual('react-intl'),
    FormattedMessage: jest.fn(({ id, children }) => {
      if (children) {
        return children([id]);
      }

      return id;
    }),
    useIntl: () => intl,
    injectIntl: (Component) => (props) => <Component {...props} intl={intl} />,
  };
});

const dataOptions = [
  {
    count: 5,
    label: 'Check Box 1',
    value: 'checkBox1',
  },
  {
    count: 7,
    label: 'Check Box 2',
    value: 'checkBox2',
  },
  { id: 'fakeId', isDeleted: true },
];
const selectedValues = ['checkBox1'];
const fieldName = 'testFacet';
const onChange = jest.fn();
const onMoreClick = jest.fn();
const onSearch = jest.fn();
const showSearch = true;
const showMore = false;
const isPending = false;

describe('CheckboxFacetList', () => {
  beforeEach(() => {
    useSearchValue.mockReturnValue('');
  });

  it('Component should render correctly', () => {
    render(
      <CheckboxFacetList
        dataOptions={dataOptions}
        selectedValues={selectedValues}
        showMore={!showMore}
        showSearch={showSearch}
        onMoreClick={onMoreClick}
        onSearch={onSearch}
        onChange={onChange}
        fieldName={fieldName}
        isPending={isPending}
      />,
    );
    expect(screen.getAllByRole('checkbox')).toHaveLength(2);
    expect(screen.getByLabelText(`${fieldName}-field`)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'ui-inventory.more' })).toBeInTheDocument();
  });

  it('onSearch to be triggered when typing in the search field', async () => {
    render(
      <CheckboxFacetList
        dataOptions={dataOptions}
        selectedValues={selectedValues}
        showMore={showMore}
        showSearch={showSearch}
        onMoreClick={onMoreClick}
        onSearch={onSearch}
        onChange={onChange}
        fieldName={fieldName}
        isPending={isPending}
      />,
    );

    fireEvent.change(screen.getByLabelText(`${fieldName}-field`), { target: { value: 'Test Search' } });
    expect(onSearch).toBeCalledWith('Test Search');
  });
  it('noMatchingOptions should be render when dataOptions is empty', () => {
    render(
      <CheckboxFacetList
        dataOptions={[]}
        selectedValues={selectedValues}
        showMore={showMore}
        showSearch={showSearch}
        onMoreClick={onMoreClick}
        onSearch={onSearch}
        onChange={onChange}
        fieldName={fieldName}
        isPending={isPending}
      />,
    );
    expect(screen.getByText('ui-inventory.noMatchingOptions')).toBeInTheDocument();
  });
  it('checkbox should not render when isPending is true', () => {
    render(
      <CheckboxFacetList
        dataOptions={dataOptions}
        selectedValues={selectedValues}
        showMore={showMore}
        showSearch={showSearch}
        onMoreClick={onMoreClick}
        onSearch={onSearch}
        onChange={onChange}
        fieldName={fieldName}
        isPending={!isPending}
      />,
    );
    const checkBoxs = screen.findAllByRole('checkbox');
    expect(checkBoxs).toMatchObject({});
  });

  it('should not render deleted options', () => {
    render(
      <CheckboxFacetList
        dataOptions={dataOptions}
        selectedValues={selectedValues}
        showMore={showMore}
        showSearch={showSearch}
        onMoreClick={onMoreClick}
        onSearch={onSearch}
        onChange={onChange}
        fieldName={fieldName}
        isPending={isPending}
      />,
    );

    const allOptions = screen.getAllByRole('checkbox').length;

    expect(allOptions).toBe(2);
  });
});
