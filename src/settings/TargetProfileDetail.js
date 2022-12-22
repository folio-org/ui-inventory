import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { stripesConnect } from '@folio/stripes/core';
import {
  Col,
  KeyValue,
  MultiColumnList,
  Row,
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
      jobProfiles: PropTypes.shape({
        records: PropTypes.arrayOf(
          PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
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
    jobProfiles: {
      type: 'okapi',
      records: 'jobProfiles',
      path: 'data-import-profiles/jobProfiles?limit=5000&query=dataType==("MARC") sortBy name',
    },
  });

  getJobProfilesContent = (profileIds, defaultProfileId) => {
    const { resources: { jobProfiles } } = this.props;

    const content = [...profileIds];
    const indexOfDefault = content.indexOf(defaultProfileId);

    if (indexOfDefault > -1) {
      content.splice(indexOfDefault, 1);
      content.unshift(defaultProfileId);
    }

    return content.map(id => ({
      id,
      name: jobProfiles?.records.find(jobProfile => jobProfile.id === id)?.name,
    }));
  }

  getJobProfilesFormatter = defaultProfileId => ({
    id: ({ name, id }) => (
      <>
        <TextLink
          to={`/settings/data-import/job-profiles/view/${id}`}
          target="_blank"
        >
          {name}
        </TextLink>
        <span>{`(${id})`}</span>
      </>
    ),
    isDefault: ({ id }) => defaultProfileId === id
      ? <FormattedMessage id="ui-inventory.defaultJobProfile" />
      : null,
  });

  render() {
    const {
      initialValues,
      initialValues: {
        allowedCreateJobProfileIds = [],
        allowedUpdateJobProfileIds = [],
        createJobProfileId = '',
        updateJobProfileId = '',
      },
    } = this.props;

    const t = initialValues.targetOptions;
    const targetOptions = !t ? null : (
      <ul>
        {Object.keys(t).sort().map(key => <li key={key}>{key}: {t[key]}</li>)}
      </ul>
    );

    const jobProfilesVisibleColumns = ['id', 'isDefault'];
    const createJobProfilesContent = this.getJobProfilesContent(allowedCreateJobProfileIds, createJobProfileId);
    const updateJobProfilesContent = this.getJobProfilesContent(allowedUpdateJobProfileIds, updateJobProfileId)
    const createJobProfilesFormatter = this.getJobProfilesFormatter(createJobProfileId);
    const updateJobProfilesFormatter = this.getJobProfilesFormatter(updateJobProfileId);

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
            <KeyValue label={<FormattedMessage id="ui-inventory.createJobProfileIds" />}>
              <MultiColumnList
                contentData={createJobProfilesContent}
                columnMapping={{
                  id: <FormattedMessage id="ui-inventory.importCreateJobProfileId" />,
                  isDefault: <FormattedMessage id="ui-inventory.defaultJobProfile" />,
                }}
                formatter={createJobProfilesFormatter}
                visibleColumns={jobProfilesVisibleColumns}
              />
            </KeyValue>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <KeyValue label={<FormattedMessage id="ui-inventory.updateJobProfileIds" />}>
              <MultiColumnList
                contentData={updateJobProfilesContent}
                columnMapping={{
                  id: <FormattedMessage id="ui-inventory.overlayUpdateJobProfileId" />,
                  isDefault: <FormattedMessage id="ui-inventory.defaultJobProfile" />,
                }}
                formatter={updateJobProfilesFormatter}
                visibleColumns={jobProfilesVisibleColumns}
              />
            </KeyValue>
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
