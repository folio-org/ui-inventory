import React from 'react';
import { FormattedDate } from 'react-intl';
import includes from 'lodash/includes';

export function formatDate(dateStr) {
  if (!dateStr) return dateStr;
  return (<FormattedDate value={dateStr} />);
}

export function craftLayerUrl(mode, location) {
  if (location) {
    const url = location.pathname + location.search;
    return includes(url, '?') ? `${url}&layer=${mode}` : `${url}?layer=${mode}`;
  }
  return null;
}
