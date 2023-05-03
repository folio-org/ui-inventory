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
  Loading,
  TextField,
  RepeatableField,
  Button,
} from '@folio/stripes/components';

import BoundWithModal from '../BoundWithModal';
import { useBoundWithTitlesByHrids } from '../../../hooks';
import usePrevious from '../../../hooks/usePrevious';

const BoundWithTitlesFields = ({
  item,
  addBoundWithTitles,
  canDelete,
}) => {
  const { formatMessage } = useIntl();

  const [isBoundWithModalOpen, setBoundWithModalOpen] = useState(false);
  const [addedHoldingsHrids, setAddedHoldingsHrids] = useState([]);
  const { isLoading, boundWithTitles: newBoundWithTitles } = useBoundWithTitlesByHrids(addedHoldingsHrids);
  const prevBoundWithTitles = usePrevious(newBoundWithTitles);

  useEffect(() => {
    if (!isEqual(prevBoundWithTitles, newBoundWithTitles)) {
      addBoundWithTitles(newBoundWithTitles);
    }
  }, [newBoundWithTitles]);

  if (isLoading) return <Loading size="large" />;

  const hridLabel = formatMessage({ id: 'ui-inventory.instanceHrid' });
  const titleLabel = formatMessage({ id: 'ui-inventory.instanceTitleLabel' });
  const holdingsHridLabel = formatMessage({ id: 'ui-inventory.holdingsHrid' });

  const headLabels = (
    <Row>
      <Col sm={4}>
        <Label tagName="legend">
          {hridLabel}
        </Label>
      </Col>
      <Col sm={4}>
        <Label tagName="legend">
          {titleLabel}
        </Label>
      </Col>
      <Col sm={4}>
        <Label tagName="legend">
          {holdingsHridLabel}
        </Label>
      </Col>
    </Row>
  );

  const renderField = field => (
    <Row>
      <Col sm={4}>
        <Field
          ariaLabel={hridLabel}
          name={`${field}.briefInstance.hrid`}
          component={TextField}
          value={boundWithTitle => boundWithTitle.briefInstance.hrid}
          disabled
        />
      </Col>
      <Col sm={4}>
        <Field
          ariaLabel={titleLabel}
          name={`${field}.briefInstance.title`}
          component={TextField}
          disabled
        />
      </Col>
      <Col sm={4}>
        <Field
          ariaLabel={holdingsHridLabel}
          name={`${field}.briefHoldingsRecord.hrid`}
          component={TextField}
          disabled
        />
      </Col>
    </Row>
  );

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

  return (
    <>
      <FieldArray
        name="boundWithTitles"
        component={RepeatableField}
        legend={<FormattedMessage id="ui-inventory.boundWithTitles" />}
        headLabels={headLabels}
        renderField={renderField}
        canAdd={false}
        canRemove={canDelete}
        onRemove={onBoundWithTitlesRemove}
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
  canDelete: PropTypes.bool,
};
BoundWithTitlesFields.defaultProps = { canDelete: true };

export default BoundWithTitlesFields;
