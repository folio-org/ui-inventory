import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import {
  Accordion,
  Col,
  KeyValue,
  Row,
} from '@folio/stripes/components';

import ItemStatus from '../../components/ItemStatus';
import ItemNotes from '../../components/ItemNotes';

import useItemOpenLoansQuery from '../../../hooks/useItemOpenLoansQuery';

const LoanAndAvailability = ({
  loanAndAvailability,
  item,
}) => {
  const { openLoans } = useItemOpenLoansQuery(item.id);

  return (
    <Accordion
      id="acc06"
      label={<FormattedMessage id="ui-inventory.item.loanAndAvailability" />}
    >
      <Row>
        <Col xs={4}>
          <KeyValue
            label={<FormattedMessage id="ui-inventory.permanentLoantype" />}
            value={loanAndAvailability.permanentLoanType}
          />
        </Col>
        <Col xs={4}>
          <KeyValue
            label={<FormattedMessage id="ui-inventory.temporaryLoantype" />}
            value={loanAndAvailability.temporaryLoanType}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={4}>
          <ItemStatus
            itemId={item.id}
            status={item.status}
            openLoan={openLoans.loans?.[0]}
          />
        </Col>
        <Col xs={4}>
          <KeyValue
            label={<FormattedMessage id="ui-inventory.item.availability.requests" />}
            value={loanAndAvailability.requestLink}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={4}>
          <KeyValue
            label={<FormattedMessage id="ui-inventory.item.availability.borrower" />}
            value={loanAndAvailability.borrower}
          />
        </Col>
        <Col xs={4}>
          <KeyValue
            label={<FormattedMessage id="ui-inventory.item.availability.loanDate" />}
            value={loanAndAvailability.loanDate}
          />
        </Col>
        <Col xs={4}>
          <KeyValue
            label={<FormattedMessage id="ui-inventory.item.availability.dueDate" />}
            value={loanAndAvailability.dueDate}
          />
        </Col>
      </Row>
      <ItemNotes notes={loanAndAvailability.circulationNotes} />
    </Accordion>
  );
};

LoanAndAvailability.propTypes = {
  loanAndAvailability: PropTypes.object.isRequired,
  item: PropTypes.object.isRequired,
};

export default LoanAndAvailability;
