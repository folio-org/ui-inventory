import { MemoryRouter } from 'react-router-dom';

import { render } from '@folio/jest-config-stripes/testing-library/react';
import { Pluggable } from '@folio/stripes/core';

import ConnectedTasksJobsButton from './ConnectedTasksJobsButton';
import ConnectedTasksJobsPane from './ConnectedTasksJobsPane';

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  Pluggable: jest.fn(() => null),
}));

const recordProps = {
  recordId: 'instance-id',
  recordObject: {
    hrid: 'in0000001',
    statusTerm: 'Cataloged',
    title: 'A resource title',
  },
  recordType: 'instance',
};

describe('ConnectedTasksJobsPlugin', () => {
  it.each([
    ['ConnectedTasksJobsButton', ConnectedTasksJobsButton],
    ['ConnectedTasksJobsPane', ConnectedTasksJobsPane],
  ])('provides the %s plugin with the current record URL', (componentType, Component) => {
    render(
      <MemoryRouter initialEntries={['/inventory/view/instance-id?layer=connected-tasks-jobs']}>
        <Component {...recordProps} />
      </MemoryRouter>,
    );

    expect(Pluggable).toHaveBeenCalledWith(expect.objectContaining({
      ...recordProps,
      componentType,
      recordUrl: '/inventory/view/instance-id?layer=connected-tasks-jobs',
      type: 'task-list',
    }), {});
  });
});
