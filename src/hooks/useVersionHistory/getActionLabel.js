/**
 * Gets translated change type label
 * @param {function} formatMessage
 * @returns {{ADDED, MODIFIED, REMOVED}}
 */
export const getActionLabel = formatMessage => {
  return {
    ADDED: formatMessage({ id: 'stripes-acq-components.audit-log.action.added' }),
    MODIFIED: formatMessage({ id: 'stripes-acq-components.audit-log.action.edited' }),
    REMOVED: formatMessage({ id: 'stripes-acq-components.audit-log.action.removed' }),
  };
};
