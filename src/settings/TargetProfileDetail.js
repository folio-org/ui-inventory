import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { isEmpty } from 'lodash';

import { stripesConnect } from '@folio/stripes/core';
import {
  Col,
  KeyValue,
  MultiColumnList,
  Row,
  TextLink,
} from '@folio/stripes/components';

import {
  DATA_IMPORT_JOB_PROFILES_ROUTE,
  LIMIT_MAX,
} from '../constants';

const JOB_PROFILES_COLUMNS_NAME = {
  ID: 'id',
  IS_DEFAULT: 'isDefault',
};
const DATA_TYPE_MARC_QUERY = 'dataType==("MARC")';

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
      defaultCreateJobProfile: PropTypes.shape({
        records: PropTypes.arrayOf(
          PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
          }).isRequired,
        ),
      }).isRequired,
      defaultUpdateJobProfile: PropTypes.shape({
        records: PropTypes.arrayOf(
          PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
          }).isRequired,
        ),
      }).isRequired,
      allowedCreateJobProfiles: PropTypes.shape({
        records: PropTypes.arrayOf(
          PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
          }).isRequired,
        ),
      }).isRequired,
      allowedUpdateJobProfiles: PropTypes.shape({
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
    defaultCreateJobProfile: {
      type: 'okapi',
      path: (_queryParams, _pathComponents, _resourceData, _logger, props) => {
        const {
          initialValues: { createJobProfileId } = {},
        } = props;

        return `${DATA_IMPORT_JOB_PROFILES_ROUTE}/${createJobProfileId}`;
      },
    },
    defaultUpdateJobProfile: {
      type: 'okapi',
      path: (_queryParams, _pathComponents, _resourceData, _logger, props) => {
        const {
          initialValues: { updateJobProfileId } = {},
        } = props;

        return `${DATA_IMPORT_JOB_PROFILES_ROUTE}/${updateJobProfileId}`;
      },
    },
    allowedCreateJobProfiles: {
      type: 'okapi',
      records: 'jobProfiles',
      path: (_queryParams, _pathComponents, _resourceData, _logger, props) => {
        const {
          initialValues: { allowedCreateJobProfileIds = [] } = {},
        } = props;
        const ids = allowedCreateJobProfileIds.join(' or ');
        const allowedIdsQuery = `id==(${ids})`;

        return `${DATA_IMPORT_JOB_PROFILES_ROUTE}?limit=${LIMIT_MAX}&query=${DATA_TYPE_MARC_QUERY} and ${allowedIdsQuery} sortBy name`;
      },
    },
    allowedUpdateJobProfiles: {
      type: 'okapi',
      records: 'jobProfiles',
      path: (_queryParams, _pathComponents, _resourceData, _logger, props) => {
        const {
          initialValues: { allowedUpdateJobProfileIds = [] } = {},
        } = props;
        const ids = allowedUpdateJobProfileIds.join(' or ');
        const allowedIdsQuery = `id==(${ids})`;

        return `${DATA_IMPORT_JOB_PROFILES_ROUTE}?limit=${LIMIT_MAX}&query=${DATA_TYPE_MARC_QUERY} and ${allowedIdsQuery} sortBy name`;
      },
    },
  });

  getJobProfilesContent = (defaultJobProfileRecord, allowedJobProfilesRecords) => {
    const content = [
      defaultJobProfileRecord,
      ...allowedJobProfilesRecords.filter(jobProfile => jobProfile?.id !== defaultJobProfileRecord?.id),
    ];

    return content.map(jobProfile => ({
      id: jobProfile?.id,
      name: jobProfile?.name,
    }));
  }

  getJobProfilesFormatter = defaultProfileId => ({
    [JOB_PROFILES_COLUMNS_NAME.ID]: ({ name, id }) => (
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
    [JOB_PROFILES_COLUMNS_NAME.IS_DEFAULT]: ({ id }) => {
      return defaultProfileId === id
        ? <FormattedMessage id="ui-inventory.defaultJobProfile" />
        : null;
    },
  });

  render() {
    const {
      initialValues,
      initialValues: {
        createJobProfileId = '',
        updateJobProfileId = '',
      },
      resources: {
        defaultCreateJobProfile: { records: [defaultCreateJobProfileRecord] },
        defaultUpdateJobProfile: { records: [defaultUpdateJobProfileRecord] },
        allowedCreateJobProfiles: { records: allowedCreateJobProfilesRecords },
        allowedUpdateJobProfiles: { records: allowedUpdateJobProfilesRecords },
      },
    } = this.props;

    const t = initialValues.targetOptions;
    const targetOptions = !t ? null : (
      <ul>
        {Object.keys(t).sort().map(key => <li key={key}>{key}: {t[key]}</li>)}
      </ul>
    );

    const jobProfilesVisibleColumns = [JOB_PROFILES_COLUMNS_NAME.ID, JOB_PROFILES_COLUMNS_NAME.IS_DEFAULT];
    const createJobProfilesContent = this.getJobProfilesContent(defaultCreateJobProfileRecord, allowedCreateJobProfilesRecords);
    const updateJobProfilesContent = this.getJobProfilesContent(defaultUpdateJobProfileRecord, allowedUpdateJobProfilesRecords);
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
            {isEmpty(createJobProfilesContent)
              ? <KeyValue label={<FormattedMessage id="ui-inventory.createJobProfileIds" />} />
              : (
                <MultiColumnList
                  contentData={createJobProfilesContent}
                  columnMapping={{
                    [JOB_PROFILES_COLUMNS_NAME.ID]: <FormattedMessage id="ui-inventory.createJobProfileIds" />,
                    [JOB_PROFILES_COLUMNS_NAME.IS_DEFAULT]: <FormattedMessage id="ui-inventory.defaultJobProfile" />,
                  }}
                  formatter={createJobProfilesFormatter}
                  visibleColumns={jobProfilesVisibleColumns}
                  columnIdPrefix="create-job-profiles"
                />
              )
            }
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            {isEmpty(updateJobProfilesContent)
              ? <KeyValue label={<FormattedMessage id="ui-inventory.updateJobProfileIds" />} />
              : (
                <MultiColumnList
                  contentData={updateJobProfilesContent}
                  columnMapping={{
                    [JOB_PROFILES_COLUMNS_NAME.ID]: <FormattedMessage id="ui-inventory.updateJobProfileIds" />,
                    [JOB_PROFILES_COLUMNS_NAME.IS_DEFAULT]: <FormattedMessage id="ui-inventory.defaultJobProfile" />,
                  }}
                  formatter={updateJobProfilesFormatter}
                  visibleColumns={jobProfilesVisibleColumns}
                  columnIdPrefix="update-job-profiles"
                />
              )
            }
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
