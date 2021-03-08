import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { stripesConnect } from '@folio/stripes/core';
import { Col, Row, KeyValue } from '@folio/stripes/components';


class TargetProfileDetail extends React.Component {
  static propTypes = {
    initialValues: PropTypes.object.isRequired,
    resources: PropTypes.shape({
      identifierType: PropTypes.shape({
        records: PropTypes.arrayOf(
          PropTypes.shape({
            name: PropTypes.string,
          }).isRequired,
        ),
      }).isRequired,
    }).isRequired,
  };

  static manifest = Object.freeze({
    identifierType: {
      type: 'okapi',
      path: 'identifier-types?query=id=!{initialValues.externalIdentifierType}',
      records: 'identifierTypes',
    },
  });

  render() {
    const { initialValues } = this.props;
    const t = initialValues.targetOptions;
    const targetOptions = !t ? null : (
      <ul>
        {Object.keys(t).sort().map(key => <li key={key}>{key}: {t[key]}</li>)}
      </ul>
    );

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
              label={<FormattedMessage id="ui-inventory.createJobProfileId" />}
              value={initialValues.createJobProfileId}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <KeyValue
              label={<FormattedMessage id="ui-inventory.updateJobProfileId" />}
              value={initialValues.updateJobProfileId}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <KeyValue
              label={<FormattedMessage id="ui-inventory.targetOptions" />}
              value={targetOptions}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <KeyValue
              label={<FormattedMessage id="ui-inventory.externalIdentifierType" />}
              value={this.props.resources.identifierType.records?.[0]?.name}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <KeyValue
              label={<FormattedMessage id="ui-inventory.enabled" />}
              value={initialValues.enabled ? '✓' : '✕'}
            />
          </Col>
        </Row>
      </div>
    );
  }
}

export default stripesConnect(TargetProfileDetail);
