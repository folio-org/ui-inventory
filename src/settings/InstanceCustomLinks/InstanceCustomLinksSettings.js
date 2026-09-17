import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { Field } from 'redux-form';
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

import css from './InstanceCustomLinks.css';

const suppress = getSourceSuppressor(RECORD_SOURCE.CONSORTIUM);
const actionSuppressor = { edit: suppress, delete: suppress };

const fieldComponents = {
  'show': ({ fieldProps }) => (
    <div className={css.showField}>
      <Field
        {...fieldProps}
        component={Checkbox}
        type="checkbox"
      />
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
  return (
    <>
      <FormattedMessage id={id} /> <span className={css.required}>*</span>
    </>
  );
};

class InstanceCustomLinksSettings extends React.Component {
  static contextType = CalloutContext;

  static propTypes = {
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    stripes: PropTypes.shape({
      connect: PropTypes.func.isRequired,
      hasPerm: PropTypes.func.isRequired,
    }).isRequired,
  };

  static manifest = Object.freeze({
    instanceCustomLinksList: {
      type: 'okapi',
      path: 'instance-custom-links',
      records: 'instanceCustomLinks',
      throwErrors: false,
    },
  });

  constructor(props) {
    super(props);

    this.connectedControlledVocab = props.stripes.connect(ControlledVocab);
  }

  showCallout = (type, message) => {
    this.context.sendCallout({
      type,
      message,
    });
  };

  handleClose = () => {
    this.props.history.push('/settings/inventory');
  };

  getCustomErrorMessages = (errors = []) => {
    // Common errors override field errors. Until they can interleave instead of
    // always deferring to backend response-derived common errors, use callouts
    // to show response-based complaints.
    errors.forEach(error => {
      const key = error.parameters?.[0]?.key;
      const code = error.code;
      if (KNOWN_INSTANCE_CUSTOM_LINK_CODES.includes(code) &&
          key && KNOWN_INSTANCE_CUSTOM_LINK_FIELDS.includes(key)) {
        switch (key) {
          case 'linkText':
            this.showCallout('error', <FormattedMessage id="ui-inventory.instanceCustomLinks.error.linkTextUnique" />);
            break;
          case 'link':
            this.showCallout('error', <FormattedMessage id="ui-inventory.instanceCustomLinks.error.linkUnique" />);
            break;
          case 'name':
            this.showCallout('error', <FormattedMessage id="ui-inventory.instanceCustomLinks.error.nameUnique" />);
            break;
          default:
            break;
        }
      } else {
        const calloutMessage = key ? `${error.message} (${key})` : error.message;
        this.showCallout('error', calloutMessage);
      }
    });

    return undefined;
  };

  render() {
    const hasPerm = this.props.stripes.hasPerm('ui-inventory.settings.instance-custom-links');

    // Since the manifest is defined to help prevent exceeding the limit on
    // link count, it sets up a dataKey prop that ControlledVocab wants to
    // use but shouldn't. Remove it.
    // eslint-disable-next-line no-unused-vars
    const { resources, dataKey, ...restProps } = this.props;
    const records = resources?.instanceCustomLinksList?.records || [];
    const atLimit = records.length >= 10;

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
                  {...restProps}
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
                    show: formatHeader('ui-inventory.show'),
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
                  dismissPane={this.handleClose}
                  getCustomErrorMessages={this.getCustomErrorMessages}
                />
              </TitleManager>
            </Paneset>
          </Layer>
        )}
      </IntlConsumer>
    );
  }
}

export default withRouter(InstanceCustomLinksSettings);
