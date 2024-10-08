import PropTypes from 'prop-types';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';

import { ControlledVocab } from '@folio/stripes/smart-components';
import { baseManifest } from '@folio/stripes-acq-components';
import { getSourceSuppressor } from '@folio/stripes/util';
import {
  TitleManager,
  useStripes,
} from '@folio/stripes/core';

import { RECORD_SOURCE } from '../constants';
import { validateUniqueness } from './validateUniqueness';

const validate = (item, index, items) => {
  const nameError = validateUniqueness(index, item, items, 'name') || undefined;

  return { name: nameError };
};

const SubjectSourcesSettings = (props) => {
  const intl = useIntl();
  const stripes = useStripes();

  const hasPerm = stripes.hasPerm('ui-inventory.settings.subject-sources');
  const suppress = getSourceSuppressor([RECORD_SOURCE.FOLIO]);

  return (
    <TitleManager
      page={intl.formatMessage({ id: 'ui-inventory.settings.inventory.title' })}
      record={intl.formatMessage({ id: 'ui-inventory.subjectSources' })}
    >
      <ControlledVocab
        {...props}
        id="subject-sources"
        stripes={stripes}
        baseUrl="subject-sources"
        records="subjectSources"
        label={<FormattedMessage id="ui-inventory.subjectSources" />}
        labelSingular={intl.formatMessage({ id: 'ui-inventory.subjectSource' })}
        objectLabel={<FormattedMessage id="ui-inventory.subjectSources" />}
        visibleFields={['name', 'code', 'source']}
        columnMapping={{
          name: intl.formatMessage({ id: 'ui-inventory.name' }),
          code: intl.formatMessage({ id: 'ui-inventory.code' }),
          source: intl.formatMessage({ id: 'ui-inventory.source' }),
        }}
        readOnlyFields={['source']}
        itemTemplate={{ source: 'local' }}
        hiddenFields={['numberOfObjects']}
        nameKey="name"
        actionSuppressor={{ edit: suppress, delete: suppress }}
        editable={hasPerm}
        validate={validate}
      />
    </TitleManager>
  );
};

SubjectSourcesSettings.manifest = Object.freeze({
  values: {
    ...baseManifest,
    path: 'subject-sources',
    records: 'subjectSources',
    GET: {
      params: { sortby: 'name' }
    },
    POST: {
      path: 'subject-sources',
    },
    PUT: {
      path: 'subject-sources/%{activeRecord.id}',
    },
    DELETE: {
      path: 'subject-sources/%{activeRecord.id}',
    },
  },
  updaterIds: [],
  activeRecord: {},
  updaters: {
    type: 'okapi',
    records: 'users',
    path: 'users',
    GET: {
      params: {
        query: (queryParams, pathComponents, resourceValues) => {
          if (resourceValues.updaterIds && resourceValues.updaterIds.length) {
            return `(${resourceValues.updaterIds.join(' or ')})`;
          }
          return null;
        },
      },
    },
  },
});

SubjectSourcesSettings.propTypes = {
  resources: PropTypes.object,
  mutator: PropTypes.object,
};

export default SubjectSourcesSettings;
