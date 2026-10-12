import queryString from 'query-string';
import { FormattedMessage } from 'react-intl';

import { AppIcon } from '@folio/stripes/core';
import {
  TextLink,
  Tooltip,
  NoValue,
} from '@folio/stripes/components';
import {
  browseModeOptions,
} from '@folio/stripes-inventory-components';

import {
  INVENTORY_ROUTE,
} from '../../constants';
import {
  getFullCallNumber,
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
  filters,
  namespace,
  data,
) => {
  const record = getFullMatchRecord(item, row.isAnchor);
  const searchParams = getSearchParams(row, browseOption, filters, data);
  const isNotClickable = isRowPreventsClick(row, browseOption);

  if (isNotClickable) return record;

  const toParams = {
    pathname: INVENTORY_ROUTE,
    search: queryString.stringify({
      selectedBrowseResult: true,
      ...searchParams,
    }),
  };

  return (
    <TextLink
      to={toParams}
    >
      {record}
    </TextLink>
  );
};


const openInNewTab = (url) => window.open(url, '_blank', 'noopener,noreferrer');

const renderMarcAuthoritiesLink = (authorityId, content) => {
  return (
    <>
      <Tooltip
        id="marc-authority-tooltip"
        text={<FormattedMessage id="ui-inventory.linkedToMarcAuthority" />}
      >
        {({ ref, ariaIds }) => {
          const url = `/marc-authorities/authorities/${authorityId}?authRefType=Authorized&segment=search`;

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
      {content}
    </>
  );
};

const getBrowseResultsFormatter = ({
  data,
  browseOption,
  filters,
  namespace,
}) => {
  const commonTargetRecordArgs = [browseOption, filters, namespace, data];

  return {
    title: r => getFullMatchRecord(r.instanceTitle, r.isAnchor),
    subject: r => {
      if (!r?.totalRecords && r?.isAnchor) {
        return <MissedMatchItem query={r?.value} />;
      }

      const subject = getTargetRecord(r?.value, r, ...commonTargetRecordArgs);
      if (browseOption === browseModeOptions.SUBJECTS && r.authorityId) {
        return renderMarcAuthoritiesLink(r.authorityId, subject);
      }

      return subject;
    },
    subjectSource: r => {
      const sourceId = r?.sourceId;
      const sourceName = data?.subjectSources.find(source => source.id === sourceId)?.name;

      return sourceName || <NoValue />;
    },
    subjectType: r => {
      const typeId = r?.typeId;
      const typeName = data?.subjectTypes.find(source => source.id === typeId)?.name;

      return typeName || <NoValue />;
    },
    callNumber: r => {
      const fullCallNumber = getFullCallNumber(r);

      if (r?.totalRecords) {
        return getTargetRecord(fullCallNumber, r, ...commonTargetRecordArgs);
      }
      return <MissedMatchItem query={r.fullCallNumber} />;
    },
    classificationNumber: r => {
      if (r?.totalRecords) {
        return getTargetRecord(r?.classificationNumber, r, ...commonTargetRecordArgs);
      }
      return <MissedMatchItem query={r.classificationNumber} />;
    },
    contributor: r => {
      if (!r?.totalRecords && r?.isAnchor) {
        return <MissedMatchItem query={r.name} />;
      }

      const fullMatchRecord = getTargetRecord(r.name, r, ...commonTargetRecordArgs);

      if (browseOption === browseModeOptions.CONTRIBUTORS && r.authorityId) {
        return renderMarcAuthoritiesLink(r.authorityId, fullMatchRecord);
      }

      return fullMatchRecord;
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
    numberOfTitles: r => ((r?.instance || r?.totalRecords) || (r?.value && !r?.isAnchor) || (r?.name && !r?.isAnchor)) && getFullMatchRecord(r?.totalRecords, r.isAnchor),
    contributors: r => r.instanceContributors?.join(' ; '),
  };
};

export default getBrowseResultsFormatter;
