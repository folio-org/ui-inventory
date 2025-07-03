import { screen } from '@folio/jest-config-stripes/testing-library/react';
import React from 'react';
import '../../../../../../test/jest/__mock__';
import { renderWithIntl, translationsProperties } from '../../../../../../test/jest/helpers';
import SubInstanceGroup from './SubInstanceGroup';

jest.mock('../../../../../hooks/useReferenceData', () => jest.fn().mockReturnValue({
  instanceRelationshipTypes : [
    {
      typeId: '169',
      name: 'This is an instance relationship type'
    },
    {
      typeId: '789',
      name: 'This is another instance relationship type'
    }
  ],
}));

const defaultProps = {
  id: 'test-id',
  label: 'Test label',
  titles: [
    {
      typeId: 'title1',
      instanceRelationshipTypeId: 'type1',
    },
    {
      typeId: 'title2',
      instanceRelationshipTypeId: 'type2',
    },
    {
      typeId: 'title3',
      instanceRelationshipTypeId: 'type2',
    },
    {
      typeId: 'title4',
      instanceRelationshipTypeId: 'type1',
    },
  ],
  titleKey: 'name',
};
const renderSubInstanceGroup = (props) => renderWithIntl(<SubInstanceGroup {...props} />, translationsProperties);

describe('SubInstanceGroup', () => {
  it('should render correctly', () => {
    renderSubInstanceGroup(defaultProps);
    expect(screen.getByText('Test label')).toBeInTheDocument();
  });
});
