import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import { screen } from '@folio/jest-config-stripes/testing-library/react';

import '../../../../test/jest/__mock__';

import { renderWithIntl, translationsProperties } from '../../../../test/jest/helpers';
import { instance } from '../../../../test/fixtures';

import InstanceDetailsContent from './InstanceDetailsContent';
import useReferenceData from '../../../hooks/useReferenceData';

jest.mock('../components/InstanceDetails', () => ({
  ...jest.requireActual('../components/InstanceDetails'),
  InstanceAdministrativeView: () => <div>InstanceAdministrativeView</div>,
  InstanceClassificationView: () => <div>InstanceClassificationView</div>,
  InstanceContributorsView: () => <div>InstanceContributorsView</div>,
  InstanceDescriptiveView: () => <div>InstanceDescriptiveView</div>,
  InstanceElecAccessView: () => <div>InstanceElecAccessView</div>,
  InstanceIdentifiersView: () => <div>InstanceIdentifiersView</div>,
  InstanceNotesView: () => <div>InstanceNotesView</div>,
  InstanceRelationshipView: () => <div>InstanceRelationshipView</div>,
  InstanceSubjectView: () => <div>InstanceSubjectView</div>,
  InstanceTitleData: () => <div>InstanceTitleData</div>,
  InstanceAcquisition: () => <div>InstanceAcquisition</div>,
}));
jest.mock('../../HoldingsList/consortium', () => ({
  ConsortialHoldings: () => <div>ConsortialHoldings</div>,
}));

jest.mock('../../../hooks/useReferenceData', () => jest.fn());
const mockReferenceData = {
  instanceTypes: [{ id: 'type1', name: 'Book' }],
  instanceStatuses: [{ id: 'status1', name: 'Available' }],
  modesOfIssuance: [{ id: 'mode1', name: 'Single' }],
  statisticalCodes: [],
  statisticalCodeTypes: [],
  alternativeTitleTypes: [],
  identifierTypesById: {},
  identifierTypes: [],
  contributorTypes: [],
  contributorNameTypes: [],
  instanceFormats: [],
  natureOfContentTerms: [],
  instanceDateTypes: [],
  instanceNoteTypes: [],
  electronicAccessRelationships: [],
  subjectSources: [],
  subjectTypes: [],
  classificationTypes: [],
};

useReferenceData.mockReturnValue(mockReferenceData);
const history = createMemoryHistory();

const renderInstanceDetailsContent = (props = {}) => {
  return renderWithIntl(
    <Router history={history}>
      <InstanceDetailsContent
        instance={instance}
        tenantId="testTenant"
        userTenantPermissions={[]}
        holdingsSection={<div>Holdings Section</div>}
        {...props}
      />
    </Router>,
    translationsProperties
  );
};

describe('InstanceDetailsContent', () => {
  it('renders the instance title', () => {
    renderInstanceDetailsContent();
    expect(screen.getByText('test')).toBeInTheDocument();
  });

  it('renders the expand/collapse all button', () => {
    renderInstanceDetailsContent();
    expect(screen.getByRole('button', { name: /collapse all/i })).toBeInTheDocument();
  });

  it('renders the holdings section', () => {
    renderInstanceDetailsContent();
    expect(screen.getByText('Holdings Section')).toBeInTheDocument();
  });

  it('should render Add holdings button', () => {
    renderInstanceDetailsContent();
    expect(screen.getByRole('button', { name: 'Add holdings' })).toBeInTheDocument();
  });

  it('should render instance details accordions', () => {
    renderInstanceDetailsContent();
    expect(screen.getByText('InstanceAdministrativeView')).toBeInTheDocument();
    expect(screen.getByText('InstanceTitleData')).toBeInTheDocument();
    expect(screen.getByText('InstanceIdentifiersView')).toBeInTheDocument();
    expect(screen.getByText('InstanceContributorsView')).toBeInTheDocument();
    expect(screen.getByText('InstanceDescriptiveView')).toBeInTheDocument();
    expect(screen.getByText('InstanceNotesView')).toBeInTheDocument();
    expect(screen.getByText('InstanceElecAccessView')).toBeInTheDocument();
    expect(screen.getByText('InstanceSubjectView')).toBeInTheDocument();
    expect(screen.getByText('InstanceClassificationView')).toBeInTheDocument();
    expect(screen.getByText('InstanceAcquisition')).toBeInTheDocument();
    expect(screen.getByText('InstanceRelationshipView')).toBeInTheDocument();
  });

  it('does not render ConsortialHoldings by default', () => {
    renderInstanceDetailsContent();
    expect(screen.queryByText('ConsortialHoldings')).not.toBeInTheDocument();
  });

  it('renders ConsortialHoldings if instance shared prop is true', () => {
    renderInstanceDetailsContent({ instance: { ...instance, source: 'CONSORTIUM-FOLIO', shared: true } });
    expect(screen.getByText('ConsortialHoldings')).toBeInTheDocument();
  });
});
