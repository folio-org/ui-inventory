/**
 * Gets translated change type label
 * @param {function} formatMessage
 * @returns {{ADDED, MODIFIED, REMOVED}}
 */
export const getActionLabel = formatMessage => {
  return {
    ADDED: formatMessage({ id: 'ui-inventory.versionHistory.action.added' }),
    MODIFIED: formatMessage({ id: 'ui-inventory.versionHistory.action.edited' }),
    REMOVED: formatMessage({ id: 'ui-inventory.versionHistory.action.removed' }),
  };
};
