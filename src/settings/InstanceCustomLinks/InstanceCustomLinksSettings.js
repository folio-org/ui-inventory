import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { ControlledVocab } from '@folio/stripes/smart-components';
import {
  Checkbox,
  Layer,
  Paneset,
} from '@folio/stripes/components';
import {
  CalloutContext,
  IntlConsumer,
  TitleManager,
} from '@folio/stripes/core';
import { getSourceSuppressor } from '@folio/stripes/util';

import {
  KNOWN_INSTANCE_CUSTOM_LINK_CODES,
  KNOWN_INSTANCE_CUSTOM_LINK_FIELDS,
  RECORD_SOURCE,
} from '../../constants';

import validateName from './validateName';
import validateLinkText from './validateLinkText';
import validateLink from './validateLink';
import validateResponse from './validateResponse';

import css from './InstanceCustomLinks.css';

const suppress = getSourceSuppressor(RECORD_SOURCE.CONSORTIUM);
const actionSuppressor = { edit: suppress, delete: suppress };

const fieldComponents = {
  'show': ({ fieldProps }) => (
    <div className={css.showField}>
      <Checkbox {...fieldProps.input} />
    </div>
  ),
};

const formatter = {
  'show': ({ show }) => (
    <div className={css.showField}>
      <Checkbox checked={show} disabled />
    </div>
  ),
};

const formatHeader = (id) => {
  return (<><FormattedMessage id={id}/> <span className={css.required}>*</span></>);
};

const classifyErrors = (errors = []) => {
  const fieldErrors = [];
  const calloutErrors = [];

  errors.forEach(error => {
    const key = error.parameters?.[0]?.key;
    const code = error.code;
    if (KNOWN_INSTANCE_CUSTOM_LINK_CODES.includes(code) &&
        key && KNOWN_INSTANCE_CUSTOM_LINK_FIELDS.includes(key)) {
      fieldErrors.push(error);
    } else {
      calloutErrors.push(error.message);
    }
  });

  return { fieldErrors, calloutErrors };
};

class InstanceCustomLinksSettings extends React.Component {
  static contextType = CalloutContext;

  static propTypes = {
    stripes: PropTypes.shape({
      connect: PropTypes.func.isRequired,
      hasPerm: PropTypes.func.isRequired,
    }).isRequired,
  };

  static manifest = Object.freeze({
    instanceCustomLinksList: {
      type: 'okapi',
      path: 'instance-custom-links',
      records: 'InstanceCustomLinks',
    },
  });

  constructor(props) {
    super(props);

    this.connectedControlledVocab = props.stripes.connect(ControlledVocab);

    this.state = {
      serverErrors: [],
    };
  }

  showCallout(type, message) {
    this.context.sendCallout({
      type,
      message: message,
    });
  }

  render() {
    const hasPerm = this.props.stripes.hasPerm('ui-inventory.settings.instance-custom-links');

    const { resources } = this.props;
    const records = resources?.instanceCustomLinksList?.records || [];
    const atLimit = records.length >= 10;

    const validator = (item) => {
      const nameErrors = validateName(item);
      const linkTextErrors = validateLinkText(item);
      const linkErrors = validateLink(item);
      const associatedServerErrors = validateResponse(item, this.state.serverErrors);

      return {
        ...associatedServerErrors,
        ...linkErrors,
        ...linkTextErrors,
        ...nameErrors
      };
    };

    const handleError = async (httpError) => {
      const body = await httpError.json().catch(() => null);
      const { fieldErrors, calloutErrors } = classifyErrors(body?.errors);

      if (fieldErrors.length > 0) {
        this.setState({ serverErrors: fieldErrors });
      }

      calloutErrors.forEach((message) => {
        this.showCallout('error', message);
      });

      throw httpError;
    };

    const mutator = {
      ...this.props.mutator,
      entries: {
        POST: (item) => this.props.mutator.entries.POST(item)
          .then((res) => {
            this.setState({ serverErrors: [] });
            return res;
          })
          .catch((err) => {
            return handleError(err);
          }),
        PUT: (item) => this.props.mutator.entries.PUT(item)
          .then((res) => {
            this.setState({ serverErrors: [] });
            return res;
          })
          .catch((err) => {
            return handleError(err);
          }),
      },
    };

    return (
      <IntlConsumer>
        {intl => (
          <Layer isOpen>
            <Paneset isRoot>
              <TitleManager
                page={intl.formatMessage({ id: 'ui-inventory.settings.inventory.title' })}
                record={intl.formatMessage({ id: 'ui-inventory.instanceCustomLinks' })}
              >
                <this.connectedControlledVocab
                  {...this.props}
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
                  itemTemplate={{ source: 'local' , show: true }}
                  hiddenFields={['description', 'numberOfObjects', 'source']}
                  nameKey="name"
                  id="instanceCustomLinks"
                  sortby="name"
                  editable={hasPerm}
                  hideCreateButton={atLimit}
                  formatter={formatter}
                  validate={item => validator(item)}
                  fieldComponents={fieldComponents}
                  mutator={mutator}
                />
              </TitleManager>
            </Paneset>
          </Layer>
        )}
      </IntlConsumer>
    );
  }
}

export default InstanceCustomLinksSettings;
