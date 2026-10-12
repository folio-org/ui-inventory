import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  orderBy,
  isEmpty,
} from 'lodash';

import {
  Accordion,
} from '@folio/stripes/components';

import {
  getSortedNotes,
} from '../../../../../utils';

import InstanceNotesList from './InstanceNotesList';

const InstanceNotesView = ({
  id,
  instance = {},
  noteTypes = [],
}) => {
  const notesGroups = useMemo(() => {
    if (isEmpty(instance.notes)) {
      return [{ key: -1, noteType: { name: <FormattedMessage id="ui-inventory.note" /> } }];
    }

    return orderBy(
      getSortedNotes(instance, 'instanceNoteTypeId', noteTypes),
      ['noteType.name'],
      ['asc'],
    );
  }, [instance, noteTypes]);

  return (
    <Accordion
      id={id}
      label={<FormattedMessage id="ui-inventory.instanceNotes" />}
    >
      {
        notesGroups.map((group, idx) => {
          const groupName = group.noteType?.name || <FormattedMessage id="ui-inventory.unknownNoteType" />;

          return (
            <InstanceNotesList
              id={`list-instance-notes-${idx}`}
              key={group.key}
              notes={group.notes}
              notesType={groupName}
            />
          );
        })
      }
    </Accordion>
  );
};

InstanceNotesView.propTypes = {
  id: PropTypes.string,
  instance: PropTypes.object,
  noteTypes: PropTypes.arrayOf(PropTypes.object),
};

export default InstanceNotesView;
