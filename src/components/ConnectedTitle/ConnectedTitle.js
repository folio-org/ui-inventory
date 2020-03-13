import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Link from 'react-router-dom/Link';

import {
  KeyValue,
  Row,
  Col,
} from '@folio/stripes/components';

import InstancePlugin from '../InstancePlugin';
import TitleLabel from '../TitleLabel';
import { getIdentifiers } from '../../utils';
import { indentifierTypeNames } from '../../constants';
import DataContext from '../../contexts/DataContext';

const ConnectedTitle = ({ instance, onSelect, titleIdKey }) => {
  const { identifierTypesById } = useContext(DataContext);
  const {
    id,
    title,
    hrid,
    identifiers,
  } = instance;
  const {
    ISSN,
    ISBN,
  } = indentifierTypeNames;
  const issn = getIdentifiers(identifiers, ISSN, identifierTypesById);
  const isbn = getIdentifiers(identifiers, ISBN, identifierTypesById);

  return (
    <Row bottom="xs">
      <Col xs>
        <KeyValue
          label={
            <TitleLabel
              label={<FormattedMessage id="ui-inventory.precedingField.title" />}
              subLabel={<FormattedMessage id="ui-inventory.precedingField.connected" />}
              required
            />
          }
          value={
            <Link
              data-test-connected-instance-title
              target="_blank"
              to={`/inventory/view/${instance[titleIdKey]}`}
            >
              {title}
            </Link>
          }
        />
      </Col>
      <Col xs={1}>
        <InstancePlugin onSelect={onSelect} />
      </Col>
      <Col xs>
        <KeyValue
          label={<FormattedMessage id="ui-inventory.instanceHrid" />}
          value={hrid || <FormattedMessage id="ui-inventory.notAvailable" />}
        />
      </Col>
      <Col xs>
        <KeyValue
          label={<FormattedMessage id="ui-inventory.isbn" />}
          value={isbn || <FormattedMessage id="ui-inventory.notAvailable" />}
        />
      </Col>
      <Col xs>
        <KeyValue
          label={<FormattedMessage id="ui-inventory.issn" />}
          value={issn || <FormattedMessage id="ui-inventory.notAvailable" />}
        />
      </Col>
    </Row>
  );
};

ConnectedTitle.propTypes = {
  instance: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  titleIdKey: PropTypes.string.isRequired,
};

export default ConnectedTitle;
