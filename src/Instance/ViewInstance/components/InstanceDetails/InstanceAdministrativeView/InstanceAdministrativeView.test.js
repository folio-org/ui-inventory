import React from 'react';
import { Router } from 'react-router';
import { noop } from 'lodash';

import '../../../../../../test/jest/__mock__';

import renderWithIntl from '../../../../../../test/jest/helpers/renderWithIntl';
import translationsProperties from '../../../../../../test/jest/helpers/translationsProperties';
import { instances as instancesFixture } from '../../../../../../test/fixtures/instances';
import InstanceAdministrativeView from './InstanceAdministrativeView';
import { QUERY_INDEXES } from '../../../../../constants';

const getHistory = search => ({
  length: 1,
  action: 'POP',
  location: {
    search,
  },
  block: noop,
  push: noop,
  replace: noop,
  listen: noop,
  createHref: noop,
  go: noop,
  goBack: noop,
  goForward: noop,
});

const defaultHRID = '11110000';

const searchInstance = qIndex => `?qindex=${qIndex}&query=${defaultHRID}`;

const setupInstanceAdministrativeView = ({
  instance = instancesFixture[0],
  history
}) => {
  const component = (
    <Router history={history}>
      <InstanceAdministrativeView
        id={instance.id}
        instance={{ ...instance, hrid: defaultHRID, metadata: null, discoverySuppress: true }}
      />
    </Router>
  );

  return renderWithIntl(
    component,
    translationsProperties
  );
};

describe('InstanceAdministrativeView', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should show supress from discovery warning', () => {
    const history = getHistory(searchInstance(QUERY_INDEXES.INSTANCE_HRID));
    const { getByText } = setupInstanceAdministrativeView({ history });

    expect(getByText(/suppressed from discovery/i)).toBeInTheDocument();
  });

  it('renders Instance HRID', () => {
    const history = getHistory(searchInstance(QUERY_INDEXES.INSTANCE_HRID));
    const { getByText } = setupInstanceAdministrativeView({ history });

    expect(getByText(defaultHRID)).toBeInTheDocument();
  });

  it('highlights Instance HRID if instance is searched by Instance HRID', () => {
    const history = getHistory(searchInstance(QUERY_INDEXES.INSTANCE_HRID));
    const { getByText } = setupInstanceAdministrativeView({ history });

    expect(getByText(defaultHRID)).toHaveAttribute('data-test-highlighter-mark', 'true');
  });

  it('renders Instance HRID without highlight if instance is not searched by Instance HRID', () => {
    const history = getHistory(searchInstance(QUERY_INDEXES.BARCODE));
    const { getByText } = setupInstanceAdministrativeView({ history });

    expect(getByText(defaultHRID)).not.toHaveAttribute('data-test-highlighter-mark');
  });

  describe('Source value field', () => {
    describe('when source is "CONSORTIUM-FOLIO"', () => {
      it('should render correct source value', () => {
        const history = getHistory(searchInstance(QUERY_INDEXES.BARCODE));
        const { getByText } = setupInstanceAdministrativeView({
          history,
          instance: instancesFixture[2],
        });

        expect(getByText('FOLIO-shared')).toBeInTheDocument();
      });
    });

    describe('when source is "CONSORTIUM-MARC"', () => {
      it('should render correct source value', () => {
        const history = getHistory(searchInstance(QUERY_INDEXES.BARCODE));
        const { getByText } = setupInstanceAdministrativeView({
          history,
          instance: instancesFixture[3],
        });

        expect(getByText('MARC-shared')).toBeInTheDocument();
      });
    });
  });
});
