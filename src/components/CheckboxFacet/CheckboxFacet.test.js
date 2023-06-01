import React from 'react';
import { screen, act, render } from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import '../../../test/jest/__mock__';
import { renderWithIntl, translationsProperties } from '../../../test/jest/helpers';
import CheckboxFacet from './CheckboxFacet';
import facetsStore from '../../stores/facetsStore';

const defaultProps = {
  dataOptions: [
    {
      disabled: false,
      label: 'TestOption1',
      readOnly: false,
      value: 1,
      count: 5
    },
    {
      disabled: false,
      label: 'TestOption2',
      readOnly: false,
      value: 2,
      count: 12
    },
    {
      disabled: false,
      label: 'TestOption3',
      readOnly: false,
      value: 3,
      count: 4
    },
    {
      disabled: false,
      label: 'TestOption4',
      readOnly: false,
      value: 4,
      count: 6
    },
    {
      disabled: false,
      label: 'TestOption5',
      readOnly: false,
      value: 5,
      count: 8
    },
    {
      disabled: false,
      label: 'TestOption6',
      readOnly: false,
      value: 6,
      count: 10
    }
  ],
  onFetch: jest.fn(),
  onSearch: ({ name, value }) => {
    facetsStore.getState().setFacetSettings(name, { value });
  },
  name: 'Test Name',
  onChange: jest.fn(),
  isPending: false,
  selectedValues: [1, 5],
  isFilterable: true
};

const renderCheckboxFacet = (props, renderer = render) => renderWithIntl(
  <CheckboxFacet {...props} />,
  translationsProperties,
  renderer
);

describe('CheckboxFacet', () => {
  beforeEach(() => {
    facetsStore.getState().resetFacetSettings();
  });

  it('Component should render', () => {
    renderCheckboxFacet(defaultProps);
    expect(screen.getByRole('searchbox', { name: 'Test Name-field' })).toBeInTheDocument();
    expect(screen.getAllByRole('checkbox')).toHaveLength(5);
    expect(screen.getByRole('button', { name: 'More' })).toBeInTheDocument();
  });
  it('More options should render when More button is click', () => {
    renderCheckboxFacet(defaultProps);
    userEvent.click(screen.getByRole('button', { name: 'More' }));
    expect(screen.getAllByRole('checkbox')).toHaveLength(6);
  });
  it('components.readonly should be render when readonly property is true', () => {
    const props = {
      dataOptions: [
        {
          disabled: false,
          label: 'Options1',
          readOnly: true,
          value: 1,
          count: 4
        }
      ],
      name: 'Test Name',
      onChange: jest.fn(),
      isPending: false
    };
    renderCheckboxFacet(props);
    expect(screen.getByText('Read-only')).toBeInTheDocument();
  });
  it('No matching options should be render when required search is not found', () => {
    const { rerender } = renderCheckboxFacet(defaultProps);
    userEvent.type(screen.getByRole('searchbox', { name: 'Test Name-field' }), 'test search');

    renderCheckboxFacet(defaultProps, rerender);

    expect(screen.getByText('No matching options')).toBeInTheDocument();
  });
  it('component should re-render ', () => {
    const props = {
      dataOptions: [
        {
          disabled: false,
          label: 'TestOption1',
          readOnly: false,
          value: 1,
          count: 5
        },
        {
          disabled: false,
          label: 'TestOption2',
          readOnly: false,
          value: 2,
          count: 12
        },
        {
          disabled: false,
          label: 'TestOption3',
          readOnly: false,
          value: 3,
          count: 4
        },
        {
          disabled: false,
          label: 'TestOption4',
          readOnly: false,
          value: 4,
          count: 6
        },
        {
          disabled: false,
          label: 'TestOption5',
          readOnly: false,
          value: 5,
          count: 8
        },
        {
          disabled: false,
          label: 'TestOption6',
          readOnly: false,
          value: 6,
          count: 10
        },
        {
          disabled: false,
          label: 'TestOption7',
          readOnly: false,
          value: 7,
          count: 19
        },
        {
          disabled: false,
          label: 'TestOption8',
          readOnly: false,
          value: 8,
          count: 17
        }
      ],
      onFetch: jest.fn(),
      onSearch: jest.fn(),
      name: 'Test Name',
      onChange: jest.fn(),
      isPending: false,
      selectedValues: [7, 8, 6],
      isFilterable: true
    };
    const { rerender } = renderCheckboxFacet(defaultProps);

    userEvent.click(screen.getByRole('button', { name: 'More' }));
    renderCheckboxFacet(props, rerender);

    userEvent.click(screen.getByRole('checkbox', { name: 'TestOption3 4' }));
    userEvent.click(screen.getByRole('checkbox', { name: 'TestOption7 19' }));

    expect(screen.getAllByRole('checkbox')).toHaveLength(8);
  });
});
