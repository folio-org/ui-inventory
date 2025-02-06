import {
  useIntl,
  FormattedMessage,
} from 'react-intl';
import { Field } from 'react-final-form';

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

const CardsPerVersionHistoryPageForm = ({
  handleSubmit,
  pristine,
  submitting,
  values,
  onCancel
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
        dismissible
        onClose={onCancel}
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
            />
          </Col>
        </Row>
      </Pane>
    </form>
  );
};

export default stripesFinalForm({
  navigationCheck: true,
  subscription: { values: true },
})(CardsPerVersionHistoryPageForm);
