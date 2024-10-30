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

const SubjectTypesSettings = (props) => {
  const intl = useIntl();
  const stripes = useStripes();

  const hasPerm = stripes.hasPerm('ui-inventory.settings.subject-types');
  const suppress = getSourceSuppressor([RECORD_SOURCE.FOLIO, RECORD_SOURCE.CONSORTIUM]);

  return (
    <TitleManager
      page={intl.formatMessage({ id: 'ui-inventory.settings.inventory.title' })}
      record={intl.formatMessage({ id: 'ui-inventory.subjectTypes' })}
    >
      <ControlledVocab
        {...props}
        id="subject-types"
        stripes={stripes}
        baseUrl="subject-types"
        records="subjectTypes"
        label={<FormattedMessage id="ui-inventory.subjectTypes" />}
        labelSingular={intl.formatMessage({ id: 'ui-inventory.subjectType' })}
        objectLabel={<FormattedMessage id="ui-inventory.subjectTypes" />}
        visibleFields={['name', 'source']}
        columnMapping={{
          name: intl.formatMessage({ id: 'ui-inventory.name' }),
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

SubjectTypesSettings.manifest = Object.freeze({
  values: {
    ...baseManifest,
    path: 'subject-types',
    records: 'subjectTypes',
    GET: {
      params: { sortby: 'name' }
    },
    POST: {
      path: 'subject-types',
    },
    PUT: {
      path: 'subject-types/%{activeRecord.id}',
    },
    DELETE: {
      path: 'subject-types/%{activeRecord.id}',
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

SubjectTypesSettings.propTypes = {
  resources: PropTypes.object,
  mutator: PropTypes.object,
};

export default SubjectTypesSettings;
