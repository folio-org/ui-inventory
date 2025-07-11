import { Router } from 'react-router';
import { createMemoryHistory } from 'history';

import {
  screen,
  act,
} from '@folio/jest-config-stripes/testing-library/react';
import { runAxeTest } from '@folio/stripes-testing';
import { segments } from '@folio/stripes-inventory-components';

import '../../../../../../test/jest/__mock__';

import { DataContext } from '../../../../../contexts';
import InstanceSubjectView from './InstanceSubjectView';

import {
  renderWithIntl,
  translationsProperties,
} from '../../../../../../test/jest/helpers';

const history = createMemoryHistory();

const defaultProps = {
  id: 'subject-accordion',
  subjects: [{
    value: 'subject 1',
    sourceId: 'source1',
    typeId: 'type1',
  }, {
    value: 'subject 2',
    sourceId: 'source2',
    typeId: 'type2',
  }],
  subjectSources: [{
    id: 'source1',
    name: 'source 1',
  }, {
    id: 'source2',
    name: 'source 2',
  }],
  subjectTypes: [{
    id: 'type1',
    name: 'type 1',
  }, {
    id: 'type2',
    name: 'type 2',
  }],
};

const renderInstanceSubjectView = (props) => renderWithIntl(
  <Router history={history}>
    <DataContext.Provider value="Subject">
      <InstanceSubjectView
        source="MARC"
        segment={segments.instances}
        {...props}
      />
    </DataContext.Provider>
  </Router>,
  translationsProperties,
);

describe('InstanceSubjectView', () => {
  it('should be rendered with no axe errors', async () => {
    const { container } = await act(async () => renderInstanceSubjectView({ ...defaultProps }));

    await runAxeTest({ rootNode: container });
  });

  it('should render Subject accordion', () => {
    renderInstanceSubjectView({ ...defaultProps });

    expect(screen.getByText('Subject')).toBeInTheDocument();
  });

  it('should render correct table columns', () => {
    renderInstanceSubjectView({ ...defaultProps });

    expect(screen.getByText('Subject headings')).toBeInTheDocument();
    expect(screen.getByText('Subject source')).toBeInTheDocument();
    expect(screen.getByText('Subject type')).toBeInTheDocument();
  });

  it('should render correct table content', () => {
    renderInstanceSubjectView({ ...defaultProps });

    expect(screen.getByText('subject 1')).toBeInTheDocument();
    expect(screen.getByText('source 1')).toBeInTheDocument();
    expect(screen.getByText('type 1')).toBeInTheDocument();
    expect(screen.getByText('subject 2')).toBeInTheDocument();
    expect(screen.getByText('source 2')).toBeInTheDocument();
    expect(screen.getByText('type 2')).toBeInTheDocument();
  });
});
