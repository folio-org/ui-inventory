import React from 'react';
import { screen, render, fireEvent } from '@folio/jest-config-stripes/testing-library/react';
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

const moreOptions = [
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
];

const renderCheckboxFacet = (props = {}, renderer = render) => renderWithIntl(
  <CheckboxFacet {...defaultProps} {...props} />,
  translationsProperties,
  renderer
);

describe('CheckboxFacet', () => {
  beforeEach(() => {
    facetsStore.getState().resetFacetSettings();
  });

  it('should render component', () => {
    renderCheckboxFacet();

    expect(screen.getByRole('searchbox', { name: 'Test Name-field' })).toBeInTheDocument();
    expect(screen.getAllByRole('checkbox')).toHaveLength(5);
    expect(screen.getByRole('button', { name: 'More' })).toBeInTheDocument();
  });

  describe('when more button is clicked', () => {
    it('should render more options', () => {
      renderCheckboxFacet();

      fireEvent.click(screen.getByRole('button', { name: 'More' }));
      expect(screen.getAllByRole('checkbox')).toHaveLength(6);
    });

    describe('and then component re-renders with fewer options', () => {
      it('should show More button', () => {
        const { rerender } = renderCheckboxFacet();

        fireEvent.click(screen.getByRole('button', { name: 'More' }));
        renderCheckboxFacet({ dataOptions: moreOptions }, rerender);

        renderCheckboxFacet(defaultProps, rerender);
        expect(screen.getByRole('button', { name: 'More' })).toBeInTheDocument();
      });
    });
  });

  describe('when readonly property is true', () => {
    it('should render components.readonly ', () => {
      renderCheckboxFacet({
        dataOptions: [
          {
            disabled: false,
            label: 'Options1',
            readOnly: true,
            value: 1,
            count: 4
          },
        ],
      });

      expect(screen.getByText('Read-only')).toBeInTheDocument();
    });
  });

  describe('when required search is not found', () => {
    it('should render "No matching options" message', () => {
      const { rerender } = renderCheckboxFacet();

      fireEvent.change(screen.getByRole('searchbox', { name: 'Test Name-field' }), { target: { value: 'test search' } });

      renderCheckboxFacet(defaultProps, rerender);

      expect(screen.getByText('No matching options')).toBeInTheDocument();
    });
  });

  describe('when dataOptions change', () => {
    describe('when new options are added', () => {
      it('should render new options', () => {
        const newProps = {
          dataOptions: moreOptions,
          selectedValues: [7, 8, 6],
        };
        const { rerender } = renderCheckboxFacet();

        fireEvent.click(screen.getByRole('button', { name: 'More' }));
        renderCheckboxFacet(newProps, rerender);

        fireEvent.click(screen.getByRole('checkbox', { name: 'TestOption3 4' }));
        fireEvent.click(screen.getByRole('checkbox', { name: 'TestOption7 19' }));

        expect(screen.getAllByRole('checkbox')).toHaveLength(8);
      });
    });
  });
});
