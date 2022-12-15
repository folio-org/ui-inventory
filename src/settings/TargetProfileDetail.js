import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { stripesConnect } from '@folio/stripes/core';
import {
  Col,
  Row,
  KeyValue,
  MultiColumnList,
  TextLink,
} from '@folio/stripes/components';


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
    const { initialValues: initialValuesOrig } = this.props;
    const initialValues = {
      ...initialValuesOrig,
      createJobProfileIds: [
        {
          id: 'testId',
          name: 'create name',
          isDefault: true,
        }
      ],
      updateJobProfileIds: [{
        id: 'testId',
        name: 'update name',
        isDefault: false, }],
    };
    const t = initialValues.targetOptions;
    const targetOptions = !t ? null : (
      <ul>
        {Object.keys(t).sort().map(key => <li key={key}>{key}: {t[key]}</li>)}
      </ul>
    );

    const createUpdateJobProfilesFormatter = {
      id: ({ name, id }) => (
        <>
          <TextLink
            to={`/settings/data-import/job-profiles/view/${id}`}
            target="_blank"
          >
            {name}
          </TextLink>
          {`(${id})`}
        </>
      ),
      isDefault: ({ isDefault }) => isDefault ? <FormattedMessage id="ui-inventory.defaultJobProfile" /> : null,
    };
    const createUpdateJobProfilesVisibleColumns = ['id', 'isDefault'];

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
            <MultiColumnList
              contentData={initialValues.createJobProfileIds}
              columnMapping={{
                id: <FormattedMessage id="ui-inventory.createJobProfileIds" />,
                isDefault: <FormattedMessage id="ui-inventory.defaultJobProfile" />,
              }}
              formatter={createUpdateJobProfilesFormatter}
              visibleColumns={createUpdateJobProfilesVisibleColumns}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <MultiColumnList
              contentData={initialValues.updateJobProfileIds}
              columnMapping={{
                id: <FormattedMessage id="ui-inventory.updateJobProfileIds" />,
                isDefault: <FormattedMessage id="ui-inventory.defaultJobProfile" />,
              }}
              formatter={createUpdateJobProfilesFormatter}
              visibleColumns={createUpdateJobProfilesVisibleColumns}
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
