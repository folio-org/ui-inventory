import queryString from 'query-string';
import { FormattedMessage } from 'react-intl';

import { AppIcon } from '@folio/stripes/core';
import {
  TextLink,
  Tooltip,
} from '@folio/stripes/components';

import {
  browseModeOptions,
  INVENTORY_ROUTE,
} from '../../constants';
import {
  getSearchParams,
  isRowPreventsClick,
} from './utils';
import MissedMatchItem from '../MissedMatchItem';

import css from './BrowseResultsList.css';

const getFullMatchRecord = (item, isAnchor) => {
  if (isAnchor) {
    return <strong>{item}</strong>;
  }

  return item;
};

const getTargetRecord = (
  item,
  row,
  browseOption,
  browseSearch,
  pageConfig,
) => {
  const record = getFullMatchRecord(item, row.isAnchor);
  const searchParams = getSearchParams(row, browseOption);
  const isNotClickable = isRowPreventsClick(row, browseOption);

  if (isNotClickable) return record;

  const toParams = {
    pathname: INVENTORY_ROUTE,
    search: queryString.stringify({
      selectedBrowseResult: true,
      ...searchParams,
    }),
    state: {
      browseSearch,
      pageConfig,
    },
  };

  return (
    <TextLink to={toParams}>
      {record}
    </TextLink>
  );
};

const openInNewTab = (url) => window.open(url, '_blank', 'noopener,noreferrer');

const getBrowseResultsFormatter = ({
  data,
  browseOption,
  search: browseSearch,
  pageConfig,
}) => {
  return {
    title: r => getFullMatchRecord(r.instance?.title, r.isAnchor),
    subject: r => {
      if (r?.totalRecords) {
        return getTargetRecord(r?.subject, r, browseOption, browseSearch, pageConfig);
      }
      return <MissedMatchItem query={r.subject} />;
    },
    callNumber: r => {
      if (r?.instance || r?.totalRecords) {
        return getTargetRecord(r?.fullCallNumber, r, browseOption, browseSearch, pageConfig);
      }
      return <MissedMatchItem query={r.fullCallNumber} />;
    },
    contributor: r => {
      if (r?.totalRecords) {
        const fullMatchRecord = getTargetRecord(r.name, r, browseOption, browseSearch, pageConfig);
        const isBrowseContributors = browseOption === browseModeOptions.CONTRIBUTORS;

        if (isBrowseContributors && r.authorityId) {
          return (
            <>
              <Tooltip
                id="marc-authority-tooltip"
                text={<FormattedMessage id="ui-inventory.linkedToMarcAuthority" />}
              >
                {({ ref, ariaIds }) => {
                  const url = `/marc-authorities/authorities/${r.authorityId}?segment=search`;

                  return (
                    <span
                      role="link" // fake link to avoid Warning: validateDOMNesting(...): <a> cannot appear as a descendant of <a>
                      tabIndex="0"
                      ref={ref}
                      aria-labelledby={ariaIds.text}
                      data-link="authority-app"
                      data-testid="authority-app-link"
                      onClick={() => openInNewTab(url)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          openInNewTab(url);
                        }
                      }}
                    >
                      <AppIcon
                        size="small"
                        app="marc-authorities"
                        iconClassName={css.authorityIcon}
                      />
                    </span>
                  );
                }}
              </Tooltip>
              {fullMatchRecord}
            </>
          );
        }

        return fullMatchRecord;
      }
      return <MissedMatchItem query={r.name} />;
    },
    contributorType: r => data.contributorNameTypes.find(nameType => nameType.id === r.contributorNameTypeId)?.name || '',
    relatorTerm: r => {
      if (!r.contributorTypeId) {
        return '';
      }

      return r.contributorTypeId.reduce((acc, contributorTypeId) => {
        return [...acc, data.contributorTypes.find(type => type.id === contributorTypeId)?.name || ''];
      }, []).filter(name => !!name).join(', ');
    },
    numberOfTitles: r => ((r?.instance || r?.totalRecords) || (r?.subject && r?.totalRecords > 0)) && getFullMatchRecord(r?.totalRecords, r.isAnchor),
  };
};

export default getBrowseResultsFormatter;
