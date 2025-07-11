import React from 'react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import { segments } from '@folio/stripes-inventory-components';

import '../../../../../../test/jest/__mock__';

import renderWithIntl from '../../../../../../test/jest/helpers/renderWithIntl';
import translationsProperties from '../../../../../../test/jest/helpers/translationsProperties';

import ControllableDetail from './ControllableDetail';

const history = createMemoryHistory();

const renderComponent = (props = {}) => renderWithIntl(
  <Router history={history}>
    <ControllableDetail
      authorityId="test-id"
      value="subject value"
      segment={segments.instances}
      source="MARC"
      {...props}
    >
      content
    </ControllableDetail>
  </Router>,
  translationsProperties,
);

describe('ControllableDetail', () => {
  it('should display the MARC authority app icon', () => {
    const { getByTestId } = renderComponent();

    expect(getByTestId('authority-app-link').getAttribute('href'))
      .toEqual('/marc-authorities/authorities/test-id?authRefType=Authorized&segment=search');
  });

  it('should display child content', () => {
    const { getByText } = renderComponent();

    expect(getByText('subject value')).toBeDefined();
  });

  describe('when not viewing instance record', () => {
    it('should just display value', () => {
      const {
        queryByTestId,
        getByText,
      } = renderComponent({
        segment: segments.holdings,
      });

      expect(queryByTestId('authority-app-link')).toBeNull();
      expect(getByText('subject value')).toBeDefined();
    });
  });

  describe('when item does not have authority id', () => {
    it('should just display value', () => {
      const {
        queryByTestId,
        getByText,
      } = renderComponent({
        authorityId: null,
      });

      expect(queryByTestId('authority-app-link')).toBeNull();
      expect(getByText('subject value')).toBeDefined();
    });
  });

  describe('when source is not MARC', () => {
    it('should just display value', () => {
      const {
        queryByTestId,
        getByText,
      } = renderComponent({
        source: 'FOLIO',
      });

      expect(queryByTestId('authority-app-link')).toBeNull();
      expect(getByText('subject value')).toBeDefined();
    });
  });
});
