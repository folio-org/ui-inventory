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
  useAllowedJobProfiles,
  useDefaultJobProfile,
} from '../common/hooks';

const JOB_PROFILES_COLUMNS_NAME = {
  ID: 'id',
  IS_DEFAULT: 'isDefault',
};

const getJobProfilesFormatter = defaultProfileId => ({
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

const TargetProfileDetail = props => {
  const {
    initialValues,
    initialValues: {
      createJobProfileId = '',
      updateJobProfileId = '',
      allowedCreateJobProfileIds = [],
      allowedUpdateJobProfileIds = [],
    }
  } = props;

  const { allowedJobProfiles: allowedCreateJobProfiles = [] } = useAllowedJobProfiles(allowedCreateJobProfileIds);
  const { allowedJobProfiles: allowedUpdateJobProfiles = [] } = useAllowedJobProfiles(allowedUpdateJobProfileIds);
  const { defaultJobProfile: defaultCreateJobProfile } = useDefaultJobProfile(createJobProfileId);
  const { defaultJobProfile: defaultUpdateJobProfile } = useDefaultJobProfile(updateJobProfileId);

  const getJobProfilesContent = (defaultJobProfileRecord, allowedJobProfilesRecords) => {
    const content = [
      defaultJobProfileRecord,
      ...allowedJobProfilesRecords.filter(jobProfile => jobProfile?.id !== defaultJobProfileRecord?.id),
    ];

    return content.map(jobProfile => ({
      id: jobProfile?.id,
      name: jobProfile?.name,
    }));
  };

  const t = initialValues.targetOptions;
  const targetOptions = !t ? null : (
    <ul>
      {Object.keys(t).sort().map(key => <li key={key}>{key}: {t[key]}</li>)}
    </ul>
  );

  const jobProfilesVisibleColumns = [JOB_PROFILES_COLUMNS_NAME.ID, JOB_PROFILES_COLUMNS_NAME.IS_DEFAULT];
  const createJobProfilesContent = getJobProfilesContent(defaultCreateJobProfile, allowedCreateJobProfiles);
  const updateJobProfilesContent = getJobProfilesContent(defaultUpdateJobProfile, allowedUpdateJobProfiles);
  const createJobProfilesFormatter = getJobProfilesFormatter(createJobProfileId);
  const updateJobProfilesFormatter = getJobProfilesFormatter(updateJobProfileId);

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
            value={props.resources.identifierType.records?.[0]?.name}
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
};

TargetProfileDetail.manifest = Object.freeze({
  identifierType: {
    type: 'okapi',
    path: 'identifier-types?query=id=!{initialValues.externalIdentifierType}',
    records: 'identifierTypes',
  },
});

TargetProfileDetail.propTypes = {
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

export default stripesConnect(TargetProfileDetail);
