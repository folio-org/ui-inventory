import { getActionLabel } from './getActionLabel';

const intl = { formatMessage: ({ id }) => id };

describe('getActionLabel', () => {
  it('should return correct action labels', () => {
    const labels = {
      ADDED: 'stripes-acq-components.audit-log.action.added',
      MODIFIED: 'stripes-acq-components.audit-log.action.edited',
      REMOVED: 'stripes-acq-components.audit-log.action.removed',
    };

    expect(getActionLabel(intl.formatMessage)).toEqual(labels);
  });
});
