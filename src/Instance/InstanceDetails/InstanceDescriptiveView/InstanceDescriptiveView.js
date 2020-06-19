import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  Row,
  Col,
  KeyValue,
} from '@folio/stripes/components';

import {
  checkIfElementIsEmpty,
  convertArrayToBlocks,
} from '../../../utils';

import DescriptivePublicationsList from './DescriptivePublicationsList';
import DescriptiveFormatsList from './DescriptiveFormatsList';
import {
  formatLanguages,
} from './utils';

const InstanceDescriptiveView = ({
  id,
  instance,
  resourceTypes,
  resourceFormats,
  natureOfContentTerms,
}) => {
  const resourceType = useMemo(() => {
    return resourceTypes.find(type => type.id === instance.instanceTypeId) || {};
  }, [instance, resourceTypes]);
  const formattedContentTerms = useMemo(() => {
    const natureOfContentTermsMap = natureOfContentTerms.reduce((acc, term) => {
      acc[term.id] = term.name;

      return acc;
    }, {});

    return (instance.natureOfContentTermIds || []).map(termId => natureOfContentTermsMap[termId]);
  }, [instance, natureOfContentTerms]);

  return (
    <Accordion
      id={id}
      label={<FormattedMessage id="ui-inventory.descriptiveData" />}
    >
      <DescriptivePublicationsList publications={instance.publication} />

      <br />

      <Row>
        <Col xs={6}>
          <KeyValue
            label={<FormattedMessage id="ui-inventory.edition" />}
            value={convertArrayToBlocks(instance.editions)}
          />
        </Col>
        <Col xs={6}>
          <KeyValue
            label={<FormattedMessage id="ui-inventory.physicalDescription" />}
            value={convertArrayToBlocks(instance.physicalDescriptions)}
          />
        </Col>
      </Row>

      <Row>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-inventory.resourceTypeTerm" />}
            value={checkIfElementIsEmpty(resourceType.name)}
          />
        </Col>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-inventory.resourceTypeCode" />}
            value={checkIfElementIsEmpty(resourceType.code)}
          />
        </Col>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-inventory.resourceTypeSource" />}
            value={checkIfElementIsEmpty(resourceType.source)}
          />
        </Col>
      </Row>

      <Row>
        <Col
          data-test-nature-of-content-terms
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id="ui-inventory.natureOfContentTerms" />}
            value={convertArrayToBlocks(formattedContentTerms)}
          />
        </Col>
      </Row>

      <DescriptiveFormatsList
        formats={instance.instanceFormatIds}
        resourceFormats={resourceFormats}
      />

      <br />

      <Row>
        <Col xs={12}>
          <KeyValue
            label={<FormattedMessage id="ui-inventory.language" />}
            value={formatLanguages(instance.languages)}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={6}>
          <KeyValue
            label={<FormattedMessage id="ui-inventory.publicationFrequency" />}
            value={convertArrayToBlocks(instance.publicationFrequency)}
          />
        </Col>
        <Col xs={6}>
          <KeyValue
            label={<FormattedMessage id="ui-inventory.publicationRange" />}
            value={convertArrayToBlocks(instance.publicationRange)}
          />
        </Col>
      </Row>
    </Accordion>
  );
};

InstanceDescriptiveView.propTypes = {
  id: PropTypes.string.isRequired,
  instance: PropTypes.object,
  resourceTypes: PropTypes.arrayOf(PropTypes.object),
  resourceFormats: PropTypes.arrayOf(PropTypes.object),
  natureOfContentTerms: PropTypes.arrayOf(PropTypes.object),
};

InstanceDescriptiveView.defaultProps = {
  instance: {},
  resourceTypes: [],
  resourceFormats: [],
  natureOfContentTerms: [],
};

export default InstanceDescriptiveView;
