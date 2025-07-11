import { groupBy } from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { KeyValue } from '@folio/stripes/components';

import useReferenceData from '../../../../../hooks/useReferenceData';
import SubInstanceList from '../SubInstanceList';

const SubInstanceGroup = ({
  titles,
  id,
  titleKey,
  label,
}) => {
  const { instanceRelationshipTypes } = useReferenceData();
  const titlesByInstanceRelationshipTypeId = groupBy(titles, 'instanceRelationshipTypeId');

  return (
    <KeyValue id={id} label={label}>
      {
        instanceRelationshipTypes.map(({ id: typeId, name }) => (
          titlesByInstanceRelationshipTypeId[typeId] &&
          <div key={`${id}-${typeId}`}>
            <FormattedMessage
              id="ui-inventory.instances.typeOfRelation"
              values={{ name }}
              tagName="p"
            />
            <SubInstanceList
              id={`${id}-${typeId}`}
              titles={titlesByInstanceRelationshipTypeId[typeId]}
              titleKey={titleKey}
              label={name}
            />
          </div>
        ))
      }
    </KeyValue>
  );
};

SubInstanceGroup.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.node.isRequired,
  titles: PropTypes.arrayOf(PropTypes.object).isRequired,
  titleKey: PropTypes.string.isRequired,
};

export default SubInstanceGroup;
