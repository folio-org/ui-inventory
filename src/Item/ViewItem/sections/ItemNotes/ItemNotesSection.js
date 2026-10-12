import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import { Accordion } from '@folio/stripes/components';

import ItemNotes from '../../components/ItemNotes/ItemNotes';

const ItemNotesSection = ({ itemNotes }) => {
  return (
    <Accordion
      id="acc05"
      label={<FormattedMessage id="ui-inventory.itemNotes" />}
    >
      <ItemNotes
        notes={itemNotes}
      />
    </Accordion>
  );
};

ItemNotesSection.propTypes = {
  itemNotes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default ItemNotesSection;
