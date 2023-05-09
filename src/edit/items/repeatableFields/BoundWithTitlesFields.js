import React, {
  useEffect,
  useState,
} from 'react';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import { isEqual } from 'lodash';
import { FieldArray } from 'react-final-form-arrays';
import { Field } from 'react-final-form';
import PropTypes from 'prop-types';

import {
  Row,
  Col,
  Label,
  TextField,
  RepeatableField,
  Button,
  IconButton,
} from '@folio/stripes/components';

import BoundWithModal from '../BoundWithModal';
import { useBoundWithTitlesByHrids } from '../../../hooks';
import usePrevious from '../../../hooks/usePrevious';

const BoundWithTitlesFields = ({
  item,
  addBoundWithTitles,
}) => {
  const { formatMessage } = useIntl();

  const [isBoundWithModalOpen, setBoundWithModalOpen] = useState(false);
  const [addedHoldingsHrids, setAddedHoldingsHrids] = useState([]);
  const { boundWithTitles: newBoundWithTitles } = useBoundWithTitlesByHrids(addedHoldingsHrids);
  const prevBoundWithTitles = usePrevious(newBoundWithTitles);

  useEffect(() => {
    if (!isEqual(prevBoundWithTitles, newBoundWithTitles)) {
      addBoundWithTitles(newBoundWithTitles);
    }
  }, [newBoundWithTitles]);

  const hridLabel = formatMessage({ id: 'ui-inventory.instanceHrid' });
  const titleLabel = formatMessage({ id: 'ui-inventory.instanceTitleLabel' });
  const holdingsHridLabel = formatMessage({ id: 'ui-inventory.holdingsHrid' });
  const trashcanLabel = formatMessage({ id: 'stripes-components.deleteThisItem' });

  const addBoundWiths = newHoldingsHrids => {
    setAddedHoldingsHrids(newHoldingsHrids);
    setBoundWithModalOpen(false);
  };

  const onBoundWithTitlesRemove = (fields, index) => {
    const removedField = fields.value[index];
    const newlyAddedIndex = addedHoldingsHrids.indexOf(removedField.briefHoldingsRecord.hrid);

    if (newlyAddedIndex !== -1) {
      const updatedHoldingsHrids = [...addedHoldingsHrids];
      updatedHoldingsHrids.splice(newlyAddedIndex, 1);
      setAddedHoldingsHrids(updatedHoldingsHrids);
    }

    fields.remove(index);
  };

  const headLabels = (
    <Row>
      <Col sm>
        <Label tagName="legend">
          {hridLabel}
        </Label>
      </Col>
      <Col sm>
        <Label tagName="legend">
          {titleLabel}
        </Label>
      </Col>
      <Col sm>
        <Label tagName="legend">
          {holdingsHridLabel}
        </Label>
      </Col>
      <Col sm={1}>
        <Label tagName="legend" className="sr-only">
          {trashcanLabel}
        </Label>
      </Col>
    </Row>
  );

  const renderField = (field, index, fields) => (
    <Row>
      <Col sm>
        <Field
          ariaLabel={hridLabel}
          name={`${field}.briefInstance.hrid`}
          component={TextField}
          disabled
        />
      </Col>
      <Col sm>
        <Field
          ariaLabel={titleLabel}
          name={`${field}.briefInstance.title`}
          component={TextField}
          disabled
        />
      </Col>
      <Col sm>
        <Field
          ariaLabel={holdingsHridLabel}
          name={`${field}.briefHoldingsRecord.hrid`}
          component={TextField}
          disabled
        />
      </Col>
      <Col sm={1}>
        <IconButton
          icon="trash"
          onClick={() => onBoundWithTitlesRemove(fields, index)}
          size="medium"
          disabled={fields.value[index]?.briefHoldingsRecord?.id === item?.holdingsRecordId}
          aria-label={trashcanLabel}
        />
      </Col>
    </Row>
  );

  return (
    <>
      <FieldArray
        name="boundWithTitles"
        component={RepeatableField}
        legend={<FormattedMessage id="ui-inventory.boundWithTitles" />}
        headLabels={headLabels}
        renderField={renderField}
        canAdd={false}
        onRemove={false}
      />
      <Button
        data-testid="bound-with-add-button"
        type="button"
        align="end"
        onClick={() => setBoundWithModalOpen(true)}
      >
        <FormattedMessage id="ui-inventory.boundWithTitles.add" />
      </Button>
      <BoundWithModal
        item={item}
        open={isBoundWithModalOpen}
        onClose={() => setBoundWithModalOpen(false)}
        onOk={addBoundWiths}
      />
    </>
  );
};

BoundWithTitlesFields.propTypes = {
  item: PropTypes.object.isRequired,
  addBoundWithTitles: PropTypes.func.isRequired,
};

export default BoundWithTitlesFields;
