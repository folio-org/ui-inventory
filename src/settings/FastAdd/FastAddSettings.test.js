import React from 'react';
import { Form } from 'react-final-form';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '../../../test/jest/__mock__';
import { renderWithIntl, stripesStub, translationsProperties } from '../../../test/jest/helpers';
import FastAddSettings from './FastAddSettings';

const defaultProps = {
  stripes: {
    ...stripesStub,
    connect: component => component,
  },
  label: {
    name: 'Test label'
  },
  resources: {
    instanceStatuses: {
      isPending: false,
      records: [
        {
          name: 'component 1',
          code: 'In progess'
        },
        {
          name: 'component 2',
          code: 'completed'
        }
      ]
    },
  }
};
const renderFastAddSettings = (props) => {
  const component = () => {
    return (
      <FastAddSettings {...props} />
    );
  };
  return ( 
    renderWithIntl(
      <Form
        id="form-id"
        onSubmit={jest.fn()}
        render={component}
      />,
      translationsProperties
    )
  );
};

describe('FastAddSettings', () => {
  it('Component should render correctly', () => {
    renderFastAddSettings(defaultProps);
    expect(screen.getByText('ConfigManager')).toBeInTheDocument();
    expect(screen.getByText('Default instance status')).toBeInTheDocument();
    expect(screen.getByText('Suppress from discovery by default')).toBeInTheDocument();
  });
  it('LoadingPane should be display when isPending is true', () => {
    renderFastAddSettings({ ...defaultProps, resources: { instanceStatuses: { isPending: true } } });
    expect(screen.getByText('LoadingPane')).toBeInTheDocument();
  });
  it('check for before save and get Initial Values functions', () => {
    renderFastAddSettings(defaultProps);
    userEvent.click(screen.getByRole('button', { name: 'getInitialValues' }));
    userEvent.click(screen.getByRole('button', { name: 'onBeforeSave' }));
    expect(renderFastAddSettings(defaultProps)).toBeTruthy();
  });
});

