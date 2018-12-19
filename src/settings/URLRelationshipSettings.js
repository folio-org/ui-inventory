import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { ControlledVocab } from '@folio/stripes/smart-components';

class URLRelationshipSettings extends React.Component {
  static propTypes = {
    stripes: PropTypes.shape({
      connect: PropTypes.func.isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);

    this.connectedControlledVocab = props.stripes.connect(ControlledVocab);
  }

  render() {
    return (
      <this.connectedControlledVocab
        {...this.props}
        baseUrl="electronic-access-relationships"
        records="electronicAccessRelationships"
        label={<FormattedMessage id="ui-inventory.URLrelationship" />}
        labelSingular={<FormattedMessage id="ui-inventory.urlRelationshipTerm" />}
        objectLabel={<FormattedMessage id="ui-inventory.URLrelationship" />}
        visibleFields={['name', 'source']}
        readOnlyFields={['source']}
        itemTemplate={{ source: 'local' }}
        hiddenFields={['description', 'numberOfObjects']}
        nameKey="name"
        id="electronicAccessRelationships"
        sortby="name"
      />
    );
  }
}

export default URLRelationshipSettings;
