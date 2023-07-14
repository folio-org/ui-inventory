import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import css from '../../View.css';

const LinkedInstanceDetails = ({
  item,
  instance,
}) => {
  const boundWithCount = item?.boundWithTitles?.length ?? 0;
  const instancePublicationCount = instance.publication?.length ?? 0;
  const linkedInstanceTitle = (
    <Link to={`/inventory/view/${instance.id}`}>
      {instance.title}
    </Link>
  );

  return (
    <>
      <FormattedMessage
        id="ui-inventory.instanceTitle"
        values={{ title: linkedInstanceTitle }}
      />

      {instancePublicationCount > 0 && (
        <span>
          <em>
            {` ${instance.publication[0].publisher}`}
            {instance.publication[0].dateOfPublication ? `, ${instance.publication[0].dateOfPublication}` : ''}
          </em>
        </span>
      )}

      {boundWithCount > 0 && (
        <>
          {' '}
          <span className={css.multiTitle}>
            <FormattedMessage
              id="ui-inventory.boundWith"
              values={{ boundWithCount }}
            />
          </span>
        </>
      )}
    </>
  );
};

LinkedInstanceDetails.propTypes = {
  item: PropTypes.object,
  instance: PropTypes.object,
};

export default LinkedInstanceDetails;
