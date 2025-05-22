import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import { Accordion } from '@folio/stripes/components';

import ItemNotes from '../../components/ItemNotes/ItemNotes';

const ItemNotesSection = ({
  referenceTables,
  item,
}) => {
  return (
    <Accordion
      id="acc05"
      label={<FormattedMessage id="ui-inventory.itemNotes" />}
    >
      <ItemNotes
        noteTypes={referenceTables.itemNoteTypes}
        notes={item.notes}
      />
    </Accordion>
  );
};

ItemNotesSection.propTypes = {
  referenceTables: PropTypes.object.isRequired,
  item: PropTypes.object.isRequired,
};

export default ItemNotesSection;
