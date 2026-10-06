import { useMemo } from 'react';
import { Field } from 'redux-form';
import { FormattedMessage, useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';

import { ControlledVocab } from '@folio/stripes/smart-components';
import {
  Checkbox,
  Layer,
  Paneset,
} from '@folio/stripes/components';
import {
  TitleManager,
  useStripes,
} from '@folio/stripes/core';
import { getSourceSuppressor } from '@folio/stripes/util';

import {
  RECORD_SOURCE,
} from '../../constants';
import { useCallout } from '../../hooks';
import validateName from './validateName';
import validateLinkText from './validateLinkText';
import validateLink from './validateLink';
import errorResponseNotifications from './errorResponseNotifications';

import css from './InstanceCustomLinks.css';

const suppress = getSourceSuppressor(RECORD_SOURCE.CONSORTIUM);
const actionSuppressor = { edit: suppress, delete: suppress };
const columnWidths = {
  name: '15%',
  linkText: '15%',
  link: '35%',
  show: '5%'
};

const formatHeader = (id) => {
  return (
    <>
      <FormattedMessage id={id} /> <span className={css.required}>*</span>
    </>
  );
};

const validator = (item) => {
  const nameErrors = validateName(item);
  const linkTextErrors = validateLinkText(item);
  const linkErrors = validateLink(item);

  return {
    ...linkErrors,
    ...linkTextErrors,
    ...nameErrors
  };
};

const CUSTOM_LINKS_LIMIT = 10;

// Extract limit check props from manifest, pass the rest to ControlledVocab.
export const InstanceCustomLinksSettings = ({ resources, dataKey: _dataKey, ...props }) => {
  const stripes = useStripes();
  const intl = useIntl();
  const history = useHistory();
  const callout = useCallout();

  const ConnectedControlledVocab = useMemo(() => stripes.connect(ControlledVocab), [stripes]);
  const hasPerm = stripes.hasPerm('ui-inventory.settings.instance-custom-links');
  const records = resources?.instanceCustomLinksList?.records;
  const atLimit = (records?.length ?? 0) >= CUSTOM_LINKS_LIMIT;

  const fieldComponents = useMemo(() => {
    return {
      'show': ({ fieldProps }) => (
        <div className={css.showField}>
          <Field
            {...fieldProps}
            component={Checkbox}
            type="checkbox"
            aria-label={intl.formatMessage({ id: 'ui-inventory.show' })}
          />
        </div>
      )
    };
  }, [intl]);

  const formatter = useMemo(() => {
    return {
      'show': ({ show }) => (
        <div className={css.showField}>
          <Checkbox
            checked={show}
            aria-label={intl.formatMessage({ id: 'ui-inventory.show' })}
            disabled
          />
        </div>
      )
    };
  }, [intl]);

  const handleClose = () => {
    history.push({
      pathname: '/settings/inventory',
    });
  };

  const getCustomErrorMessages = (errors = []) => {
    return errorResponseNotifications(callout, errors);
  };

  return (
    <Layer isOpen>
      <Paneset isRoot>
        <TitleManager
          page={intl.formatMessage({ id: 'ui-inventory.settings.inventory.title' })}
          record={intl.formatMessage({ id: 'ui-inventory.instanceCustomLinks' })}
        >
          <ConnectedControlledVocab
            {...props}
            baseUrl="instance-custom-links"
            records="instanceCustomLinks"
            label={<FormattedMessage id="ui-inventory.instanceCustomLinks" />}
            labelSingular={intl.formatMessage({ id: 'ui-inventory.instanceCustomLink' })}
            objectLabel={<FormattedMessage id="ui-inventory.instanceCustomLinks" />}
            visibleFields={['name', 'linkText', 'link', 'show']}
            columnMapping={{
              name: formatHeader('ui-inventory.name'),
              linkText: formatHeader('ui-inventory.linkText'),
              link: formatHeader('ui-inventory.link'),
              show: intl.formatMessage({ id: 'ui-inventory.show' }),
            }}
            actionSuppressor={actionSuppressor}
            readOnlyFields={['source']}
            itemTemplate={{ source: 'local', show: true }}
            hiddenFields={['description', 'numberOfObjects', 'source']}
            nameKey="name"
            id="instanceCustomLinks"
            sortby="name"
            editable={hasPerm}
            hideCreateButton={atLimit}
            formatter={formatter}
            validate={item => validator(item)}
            fieldComponents={fieldComponents}
            dismissPane={handleClose}
            getCustomErrorMessages={getCustomErrorMessages}
            columnWidths={columnWidths}
          />
        </TitleManager>
      </Paneset>
    </Layer>
  );
};

// React Query would require a way for the ControlledVocab component to
// call a post-success hook, but this does not currently exist, so
// use Stripes Connect to fetch this in order to fulfill the limit check.
InstanceCustomLinksSettings.manifest = Object.freeze({
  instanceCustomLinksList: {
    type: 'okapi',
    path: 'instance-custom-links',
    records: 'instanceCustomLinks',
    throwErrors: false,
  },
});
