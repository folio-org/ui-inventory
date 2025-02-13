import {
  useIntl,
  FormattedMessage,
} from 'react-intl';
import { Field } from 'react-final-form';
import PropTypes from 'prop-types';

import stripesFinalForm from '@folio/stripes/final-form';
import {
  Select,
  Pane,
  Button,
  PaneFooter,
  PaneHeader,
  Row,
  Col,
} from '@folio/stripes/components';

import css from './CardsPerVersionHistoryPageForm.css';

const propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool,
  submitting: PropTypes.bool,
};

const CardsPerVersionHistoryPageForm = ({
  handleSubmit,
  pristine,
  submitting,
}) => {
  const intl = useIntl();

  const cardsPerPageOptions = [10, 25, 50, 75, 100];

  const dataOptions = cardsPerPageOptions.map(option => ({
    label: option,
    value: option,
  }));

  const renderHeader = (paneHeaderProps) => {
    return (
      <PaneHeader
        {...paneHeaderProps}
        paneTitle={intl.formatMessage({ id: 'ui-inventory.settings.section.cardsPerPage' })}
      />
    );
  };

  const renderFooter = () => {
    const saveButton = (
      <Button
        buttonStyle="primary mega"
        marginBottom0
        disabled={(pristine || submitting)}
        id="routing-list-save-button"
        type="submit"
      >
        <FormattedMessage id="stripes-core.button.save" />
      </Button>
    );

    return (
      <PaneFooter renderEnd={saveButton} />
    );
  };

  return (
    <form
      id="cards-per-page-form"
      onSubmit={handleSubmit}
      className={css.cardsPerPageForm}
    >
      <Pane
        id="cards-per-page-pane"
        defaultWidth="fill"
        renderHeader={renderHeader}
        footer={renderFooter()}
      >
        <Row>
          <Col xs={6}>
            <Field
              name="cardsPerPage"
              label={intl.formatMessage({ id: 'ui-inventory.settings.versionHistory.versionHistoryCardsPerPage' })}
              component={Select}
              dataOptions={dataOptions}
              parse={v => parseInt(v, 10)}
            />
          </Col>
        </Row>
      </Pane>
    </form>
  );
};

CardsPerVersionHistoryPageForm.propTypes = propTypes;

export default stripesFinalForm({
  navigationCheck: true,
  subscription: { values: true },
})(CardsPerVersionHistoryPageForm);
