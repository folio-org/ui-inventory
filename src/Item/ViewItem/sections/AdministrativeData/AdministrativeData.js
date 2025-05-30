import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';

import {
  Accordion,
  Col,
  KeyValue,
  MultiColumnList,
  NoValue,
  Row,
} from '@folio/stripes/components';
import {
  ClipCopy,
  ViewMetaData,
} from '@folio/stripes/smart-components';

import {
  AdministrativeNoteList,
  WarningMessage,
} from '../../../../components';

import { convertArrayToBlocks } from '../../../../utils';

const AdministrativeData = ({
  item,
  administrativeData,
  referenceTables,
  refLookup,
}) => {
  const intl = useIntl();

  const statisticalCodeContent = !isEmpty(administrativeData.statisticalCodeIds)
    ? administrativeData.statisticalCodeIds.map(id => ({ codeId: id }))
    : [{ codeId: <NoValue /> }];

  const statisticalCodeFormatter = {
    'Statistical code type': x => {
      const statisticalCodeTypes = referenceTables.statisticalCodeTypes;
      const statisticalCodes = referenceTables.statisticalCodes;
      const statisticalCodeTypeId = refLookup(statisticalCodes, x.codeId)?.statisticalCodeTypeId;
      const statisticalCodeTypeName = refLookup(statisticalCodeTypes, statisticalCodeTypeId)?.name;

      return statisticalCodeTypeName || <NoValue />;
    },
    'Statistical code name': x => {
      const statisticalCodes = referenceTables.statisticalCodes;
      const statisticalCodeName = refLookup(statisticalCodes, x.codeId)?.name;

      return statisticalCodeName || <NoValue />;
    },
  };

  return (
    <Accordion
      id="acc01"
      label={<FormattedMessage id="ui-inventory.administrativeData" />}
    >
      <ViewMetaData metadata={item.metadata} />
      <Row>
        <Col xs={12}>
          {item.discoverySuppress && <WarningMessage id="ui-inventory.discoverySuppressed" />}
        </Col>
      </Row>
      {item.discoverySuppress && <br />}
      <Row>
        <Col xs={2}>
          <KeyValue label={<FormattedMessage id="ui-inventory.itemHrid" />}>
            {administrativeData.hrid || <NoValue />}
            {Boolean(administrativeData.hrid) && <ClipCopy text={administrativeData.hrid} />}
          </KeyValue>
        </Col>
        <Col xs={2}>
          <KeyValue label={<FormattedMessage id="ui-inventory.itemBarcode" />}>
            {administrativeData.barcode || <NoValue />}
            {Boolean(administrativeData.barcode) && <ClipCopy text={item.barcode} />}
          </KeyValue>
        </Col>
        <Col xs={2}>
          <KeyValue
            label={<FormattedMessage id="ui-inventory.accessionNumber" />}
            value={administrativeData.accessionNumber}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={2}>
          <KeyValue
            label={<FormattedMessage id="ui-inventory.itemIdentifier" />}
            value={administrativeData.identifier}
          />
        </Col>
        <Col xs={2}>
          <KeyValue
            label={<FormattedMessage id="ui-inventory.formerId" />}
            value={convertArrayToBlocks(administrativeData.formerIds)}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <MultiColumnList
            id="item-list-statistical-codes"
            contentData={statisticalCodeContent}
            visibleColumns={['Statistical code type', 'Statistical code name']}
            columnMapping={{
              'Statistical code type': intl.formatMessage({ id: 'ui-inventory.statisticalCodeType' }),
              'Statistical code name': intl.formatMessage({ id: 'ui-inventory.statisticalCodeName' }),
            }}
            formatter={statisticalCodeFormatter}
            ariaLabel={intl.formatMessage({ id: 'ui-inventory.statisticalCodes' })}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <AdministrativeNoteList administrativeNotes={administrativeData.administrativeNotes} />
        </Col>
      </Row>
    </Accordion>
  );
};

AdministrativeData.propTypes = {
  item: PropTypes.object.isRequired,
  administrativeData: PropTypes.object.isRequired,
  referenceTables: PropTypes.object.isRequired,
  refLookup: PropTypes.func.isRequired,
};

export default AdministrativeData;
