import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Icon } from '@folio/stripes/components';

import css from './MissedMatchItem.css';

const MissedMatchItem = ({ query }) => {
  return (
    <div className={css.missedMatchItemWrapper}>
      <span className={css.warnIcon}>
        <Icon
          size="medium"
          icon="exclamation-circle"
          status="warn"
        />
      </span>
      <span className={`${css.missingMatchError} ${css.fitContent}`}>
        {query}
      </span>
      <strong className={css.fitContent}>
        <FormattedMessage id="ui-inventory.browseCallNumbers.missedMatch" />
      </strong>
    </div>
  );
};

MissedMatchItem.propTypes = {
  query: PropTypes.string.isRequired,
};

export default MissedMatchItem;
