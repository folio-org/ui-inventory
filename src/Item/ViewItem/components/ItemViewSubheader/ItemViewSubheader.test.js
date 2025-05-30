import '../../../../../test/jest/__mock__';

import ItemViewSubheader from './ItemViewSubheader';

import {
  renderWithIntl,
  translationsProperties,
} from '../../../../../test/jest/helpers';

jest.mock('./LinkedInstanceDetails', () => () => <span>LinkedInstanceDetails</span>);
jest.mock('./LinkedHoldingDetails', () => () => <span>LinkedHoldingDetails</span>);

const itemMock = {
  materialType: { name: 'book' },
  status: { name: 'Available' },
  isBoundWith: true,
};

const renderItemViewSubheader = () => {
  const component = (
    <ItemViewSubheader
      item={itemMock}
      instance={{}}
      holdingsRecord={{}}
      holdingLocation={{}}
    />
  );

  return renderWithIntl(component, translationsProperties);
};

describe('ItemViewSubheader', () => {
  it('should display linked instance details', () => {
    const { getByText } = renderItemViewSubheader();

    expect(getByText('LinkedInstanceDetails')).toBeInTheDocument();
  });

  it('should display linked holdings details', () => {
    const { getByText } = renderItemViewSubheader();

    expect(getByText('LinkedHoldingDetails')).toBeInTheDocument();
  });

  it('should display item record with material type, status, and bound with in lower case in parentheses', () => {
    const { getByText } = renderItemViewSubheader();

    expect(getByText('Item record (book, available, bound with)')).toBeInTheDocument();
  });
});
