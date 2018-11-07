import React from 'react';
import PropTypes from 'prop-types';
import { ControlledVocab } from '@folio/stripes/smart-components';

class URLRelationshipSettings extends React.Component {
  static propTypes = {
    stripes: PropTypes.shape({
      connect: PropTypes.func.isRequired,
      intl: PropTypes.shape({
        formatMessage: PropTypes.func.isRequired,
      }).isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);
    this.connectedControlledVocab = props.stripes.connect(ControlledVocab);
  }

  render() {
    const { formatMessage } = this.props.stripes.intl;

    return (
      <this.connectedControlledVocab
        {...this.props}
        baseUrl="electronic-access-relationships"
        records="electronicAccessRelationships"
        label={formatMessage({ id: 'ui-inventory.URLrelationship' })}
        labelSingular={formatMessage({ id: 'ui-inventory.urlRelationshipTerm' })}
        objectLabel={formatMessage({ id: 'ui-inventory.URLrelationship' })}
        visibleFields={['name', 'source']}
        itemTemplate={{ source: 'folio' }}
        hiddenFields={['description', 'numberOfObjects']}
        nameKey="name"
        id="electronicAccessRelationships"
        sortby="name"
      />
    );
  }
}

export default URLRelationshipSettings;
