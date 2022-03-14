import React from 'react';
import { Router } from 'react-router';
import { noop } from 'lodash';

import '../../../../test/jest/__mock__';

import renderWithIntl from '../../../../test/jest/helpers/renderWithIntl';
import translationsProperties from '../../../../test/jest/helpers/translationsProperties';
import ItemBarcode from '../ItemBarcode';
import { QUERY_INDEXES } from '../../../constants';

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

const itemProp = {
  barcode: '11110000'
};

const itemBarcodeProps = {
  item: itemProp,
  holdingId: 'testId1',
  instanceId: 'testId2'
};

const searchItem = qIndex => `?qindex=${qIndex}&query=${itemProp.barcode}`;

const setupItemBarcode = ({
  item,
  holdingId,
  instanceId,
  history
}) => {
  const component = (
    <Router history={history}>
      <ItemBarcode item={item} holdingId={holdingId} instanceId={instanceId} />
    </Router>
  );

  return renderWithIntl(
    component,
    translationsProperties
  );
};

describe('<ItemBarcode>', () => {
  it('renders item barcode if there is barcode', () => {
    const history = getHistory(searchItem(QUERY_INDEXES.BARCODE));
    const { getByText } = setupItemBarcode({ ...itemBarcodeProps, history });

    expect(getByText(itemProp.barcode)).toBeInTheDocument();
  });

  it('renders "No barcode" text if there is no barcode', () => {
    const history = getHistory(searchItem(QUERY_INDEXES.BARCODE));
    const { getByText } = setupItemBarcode({ ...itemBarcodeProps, item: {}, history });

    expect(getByText('No barcode')).toBeInTheDocument();
  });

  it('highlights barcode if item is searched by Barcode', () => {
    const history = getHistory(searchItem(QUERY_INDEXES.BARCODE));
    const { getByText } = setupItemBarcode({ ...itemBarcodeProps, history });

    expect(getByText(itemProp.barcode)).toHaveAttribute('data-test-highlighter-mark', 'true');
  });

  it('renders barcode without highlight if item is not searched by Barcode', () => {
    const history = getHistory(searchItem(QUERY_INDEXES.INSTANCE_HRID));
    const { getByText } = setupItemBarcode({ ...itemBarcodeProps, history });

    expect(getByText(itemProp.barcode)).not.toHaveAttribute('data-test-highlighter-mark');
  });
});
