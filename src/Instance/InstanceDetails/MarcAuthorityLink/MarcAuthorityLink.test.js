import React from 'react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import '../../../../test/jest/__mock__';

import renderWithIntl from '../../../../test/jest/helpers/renderWithIntl';
import translationsProperties from '../../../../test/jest/helpers/translationsProperties';
import MarcAuthorityLink from './MarcAuthorityLink';

const history = createMemoryHistory();

const renderComponent = (props = {}) => renderWithIntl(
  <Router history={history}>
    <MarcAuthorityLink
      authorityId="test-id"
      {...props}
    >
      content
    </MarcAuthorityLink>
  </Router>,
  translationsProperties,
);

describe('MarcAuthorityLink', () => {
  it('should display the MARC authority app icon', () => {
    const { getByTestId } = renderComponent();

    expect(getByTestId('authority-app-link').getAttribute('href'))
      .toEqual('/marc-authorities/authorities/test-id?authRefType=Authorized&segment=search');
  });

  it('should display child content', () => {
    const { getByText } = renderComponent();

    expect(getByText('content')).toBeDefined();
  });
});
