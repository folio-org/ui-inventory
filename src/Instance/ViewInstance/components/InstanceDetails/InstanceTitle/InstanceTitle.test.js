import '../../../../../../test/jest/__mock__';

import InstanceTitle from './InstanceTitle';
import renderWithIntl from '../../../../../../test/jest/helpers/renderWithIntl';

const renderInstanceTitle = (props = {}) => renderWithIntl(
  <InstanceTitle {...props} />
);
describe('InstanceTitle', () => {
  it('should render instance title with title provided', () => {
    const props = {
      instance: { instanceTypeId: '1', name: 'testInstance', title:'testTitle' },
      instanceTypes:  [{ instanceTypeId: '1', name: 'testInstance' }, { instanceTypeId: '2', name: 'testInstance2' }]
    };
    const { getByText } = renderInstanceTitle(props);
    expect(getByText(props.instance.title)).toBeInTheDocument();
  });
});
