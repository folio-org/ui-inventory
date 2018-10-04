import React from 'react';
import { FormattedDate, FormattedTime } from 'react-intl';
import includes from 'lodash/includes';

export function formatDate(dateStr) {
  if (!dateStr) return dateStr;
  return (<FormattedDate value={dateStr} />);
}

export function formatDateTime(dateStr) {
  if (!dateStr) return dateStr;
  return (
    <span>
      <FormattedDate value={dateStr} />
      {' '}
      <FormattedTime value={dateStr} />
    </span>
  );
}

export function craftLayerUrl(mode, location) {
  const url = location.pathname + location.search;
  return includes(url, '?') ? `${url}&layer=${mode}` : `${url}?layer=${mode}`;
}
