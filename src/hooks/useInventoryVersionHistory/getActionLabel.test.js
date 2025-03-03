import { getActionLabel } from './getActionLabel';

const intl = { formatMessage: ({ id }) => id };

describe('getActionLabel', () => {
  it('should return correct action labels', () => {
    const labels = {
      ADDED: 'ui-inventory.versionHistory.action.added',
      MODIFIED: 'ui-inventory.versionHistory.action.edited',
      REMOVED: 'ui-inventory.versionHistory.action.removed',
    };

    expect(getActionLabel(intl.formatMessage)).toEqual(labels);
  });
});
