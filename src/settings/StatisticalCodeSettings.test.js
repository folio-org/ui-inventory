import React from 'react';
import { render, screen } from '@folio/jest-config-stripes/testing-library/react';
import { Form } from 'react-final-form';
import { IntlProvider } from 'react-intl';
import '../../test/jest/__mock__';
import { renderWithIntl, stripesStub, translationsProperties } from '../../test/jest/helpers';


import StatisticalCodeSettings, { validate } from './StatisticalCodeSettings';

jest.unmock('@folio/stripes/components');
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


const onSubmit = jest.mock();

const defaultProps = {
  stripes: {
    ...stripesStub,
    connect: component => component,
  },
  resources: {
    statisticalCodeTypes: {
      records: [
        { id: 'statisticalCodeType1', name: 'Statistical Code Type 1' },
        { id: 'statisticalCodeType2', name: 'Statistical Code Type 2' },
      ]
    }
  }
};

const renderStatisticalCodeSettings = async (props) => {
  const component = () => {
    return (
      <StatisticalCodeSettings {...props} />
    );
  };
  renderWithIntl(
    <Form
      id="form-user"
      onSubmit={onSubmit}
      render={component}
    />,
    translationsProperties
  );
};
const item = { code: 'testCode1', name: 'Test 1' };
const index = 0;
const items = [{ code: 'testCode1', name: 'Test 1' }, { code: 'testCode1', name: 'Test 1' }];

describe('StatisticalCodeSettings', () => {
  it('should render properly', () => {
    renderStatisticalCodeSettings(defaultProps);
    expect(screen.getByText('ControlledVocab')).toBeInTheDocument();
  });

  describe('Validate function', () => {
    it('validate function to be called', () => {
      const error = validate(item, index, items);
      render(
        <IntlProvider locale="en">
          <div>{error.code}</div>
          <div>{error.name}</div>
          <div>{error.statisticalCodeTypeId}</div>
        </IntlProvider>
      );
      expect(screen.getByText('ui-inventory.uniqueCode')).toBeInTheDocument();
      expect(screen.getByText('ui-inventory.uniqueName')).toBeInTheDocument();
      expect(screen.getByText('ui-inventory.selectToContinue')).toBeInTheDocument();
    });
    it('validate function to be called with item.statisticalCodeTypeId', () => {
      const item2 = { code: 'testCode1', name: 'Test 1', statisticalCodeTypeId: '1' };
      const error = validate(item2, index, items);
      render(
        <IntlProvider locale="en">
          <div>{error.code}</div>
          <div>{error.name}</div>
          <div>{error.statisticalCodeTypeId}</div>
        </IntlProvider>
      );
      expect(screen.getByText('ui-inventory.uniqueCode')).toBeInTheDocument();
      expect(screen.getByText('ui-inventory.uniqueName')).toBeInTheDocument();
    });
    it('validate function to be called without item.code', () => {
      const item2 = { name: 'Test 1', statisticalCodeTypeId: '1' };
      const error = validate(item2, index, items);
      render(
        <IntlProvider locale="en">
          <div>{error.code}</div>
          <div>{error.name}</div>
          <div>{error.statisticalCodeTypeId}</div>
        </IntlProvider>
      );
      expect(screen.getByText('ui-inventory.fillIn')).toBeInTheDocument();
      expect(screen.getByText('ui-inventory.uniqueName')).toBeInTheDocument();
    });
    it('validate function to be called without item.name', () => {
      const item2 = { code: 'testCode1', statisticalCodeTypeId: '1' };
      const error = validate(item2, index, items);
      render(
        <IntlProvider locale="en">
          <div>{error.code}</div>
          <div>{error.name}</div>
          <div>{error.statisticalCodeTypeId}</div>
        </IntlProvider>
      );
      expect(screen.getByText('ui-inventory.uniqueCode')).toBeInTheDocument();
      expect(screen.getByText('ui-inventory.fillIn')).toBeInTheDocument();
    });
    it('validate function to be called with single items record', () => {
      const item2 = { code: 'testCode1', name: 'Test 1' };
      const items2 = [{ code: 'testCode1', name: 'Test 1' }];
      const error = validate(item2, index, items2);
      render(
        <IntlProvider locale="en">
          <div>{error.code}</div>
          <div>{error.name}</div>
          <div>{error.statisticalCodeTypeId}</div>
        </IntlProvider>
      );
      expect(screen.getByText('ui-inventory.selectToContinue')).toBeInTheDocument();
    });
  });
});
