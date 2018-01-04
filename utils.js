import React from 'react';
import _ from 'lodash';
import queryString from 'query-string';
import { FormattedDate, FormattedTime } from 'react-intl';

export function removeQueryParam(qp, loc, hist) {
  const parsed = queryString.parse(loc.search);
  _.unset(parsed, qp);
  hist.push(`${loc.pathname}?${queryString.stringify(parsed)}`);
}

export function formatDate(dateStr) {
  if (!dateStr) return dateStr;
  return (<FormattedDate value={dateStr} />);
}

export function formatDateTime(dateStr) {
  if (!dateStr) return dateStr;
  return (<span><FormattedDate value={dateStr} /> <FormattedTime value={dateStr} /></span>);
}
