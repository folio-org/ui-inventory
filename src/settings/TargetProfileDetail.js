import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Col, Row, KeyValue } from '@folio/stripes/components';
import { ViewMetaData } from '@folio/stripes/smart-components';


class TargetProfileDetail extends React.Component {
  static propTypes = {
    stripes: PropTypes.shape({
      connect: PropTypes.func.isRequired,
    }).isRequired,
    initialValues: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.ConnectedViewMetaData = props.stripes.connect(ViewMetaData);
  }

  render() {
    const { initialValues } = this.props;

    return (
      <div>
        <Row>
          <Col xs={12}>
            <KeyValue
              label={<FormattedMessage id="ui-inventory.name" />}
              value={initialValues.name}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <KeyValue
              label={<FormattedMessage id="ui-inventory.url" />}
              value={initialValues.url}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <KeyValue
              label={<FormattedMessage id="ui-inventory.authentication" />}
              value={initialValues.authentication}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <KeyValue
              label={<FormattedMessage id="ui-inventory.externalIdQueryMap" />}
              value={initialValues.externalIdQueryMap}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <KeyValue
              label={<FormattedMessage id="ui-inventory.internalIdEmbedPath" />}
              value={initialValues.internalIdEmbedPath}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <KeyValue
              label={<FormattedMessage id="ui-inventory.importProfileId" />}
              value={initialValues.importProfileId}
            />
          </Col>
        </Row>
      </div>
    );
  }
}

export default TargetProfileDetail;
