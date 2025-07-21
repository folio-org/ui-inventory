import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import {
  Accordion,
  Col,
  Headline,
  KeyValue,
  Row,
} from '@folio/stripes/components';

const ItemData = ({ itemData, refLookup, referenceTables }) => {
  return (
    <Accordion
      id="acc02"
      label={<FormattedMessage id="ui-inventory.itemData" />}
    >
      <Row>
        <Col xs={12}>
          <KeyValue
            label={<FormattedMessage id="ui-inventory.materialType" />}
            value={itemData.materialType}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <KeyValue
            label={<FormattedMessage id="ui-inventory.shelvingOrder" />}
            value={itemData.effectiveShelvingOrder}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <Headline>
            <FormattedMessage id="ui-inventory.itemCallNumber" />
          </Headline>
        </Col>
      </Row>
      <Row>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-inventory.callNumberType" />}
            value={itemData.callNumberType}
          />
        </Col>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-inventory.callNumberPrefix" />}
            value={itemData.callNumberPrefix}
          />
        </Col>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-inventory.callNumber" />}
            value={itemData.callNumber}
          />
        </Col>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-inventory.callNumberSuffix" />}
            value={itemData.callNumberSuffix}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <KeyValue
            label={<FormattedMessage id="ui-inventory.additionalCallNumbers" />}
          >
            {itemData.additionalCallNumbers?.length > 0 ? (
              <div>
                {itemData.additionalCallNumbers.map((additionalCallNumber) => {
                  const callNumberTypeName = refLookup(referenceTables.callNumberTypes, additionalCallNumber.typeId)?.name;
                  return (
                    <div
                      key={additionalCallNumber.id}
                      style={{ marginBottom: '10px' }}
                    >
                      <Row>
                        <Col xs={3}>
                          <KeyValue
                            label={<FormattedMessage
                              id="ui-inventory.callNumberType"
                            />}
                            value={callNumberTypeName}
                          />
                        </Col>
                        <Col xs={3}>
                          <KeyValue
                            label={<FormattedMessage
                              id="ui-inventory.callNumberPrefix"
                            />}
                            value={additionalCallNumber.prefix}
                          />
                        </Col>
                        <Col xs={3}>
                          <KeyValue
                            label={<FormattedMessage
                              id="ui-inventory.callNumber"
                            />}
                            value={additionalCallNumber.callNumber}
                          />
                        </Col>
                        <Col xs={3}>
                          <KeyValue
                            label={<FormattedMessage
                              id="ui-inventory.callNumberSuffix"
                            />}
                            value={additionalCallNumber.suffix}
                          />
                        </Col>
                      </Row>
                    </div>
                  );
                })}
              </div>
            ) : (
              <FormattedMessage
                id="ui-inventory.noAdditionalCallNumbers"
              />
            )}
          </KeyValue>
        </Col>
      </Row>
      <Row>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-inventory.copyNumber" />}
            value={itemData.copyNumber}
          />
        </Col>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-inventory.numberOfPieces" />}
            value={itemData.numberOfPieces}
          />
        </Col>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-inventory.descriptionOfPieces" />}
            value={itemData.descriptionOfPieces}
          />
        </Col>
      </Row>
    </Accordion>
  );
};

ItemData.propTypes = {
  itemData: PropTypes.object.isRequired,
  refLookup: PropTypes.func.isRequired,
  referenceTables: PropTypes.object.isRequired,
};

export default ItemData;
