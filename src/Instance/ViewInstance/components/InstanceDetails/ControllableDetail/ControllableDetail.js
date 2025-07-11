import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import { AppIcon } from '@folio/stripes/core';
import {
  Tooltip,
  NoValue,
} from '@folio/stripes/components';
import { segments } from '@folio/stripes-inventory-components';

import css from './ControllableDetail.css';

const propTypes = {
  authorityId: PropTypes.string,
  value: PropTypes.string,
  segment: PropTypes.oneOf(Object.values(segments)).isRequired,
  source: PropTypes.string.isRequired,
};

const ControllableDetail = ({
  authorityId,
  value,
  segment,
  source,
}) => {
  const intl = useIntl();

  const _segment = segment ?? segments.instances;

  if (_segment === segments.instances && source === 'MARC' && authorityId) {
    return (
      <>
        <Tooltip
          id="marc-authority-tooltip"
          text={intl.formatMessage({ id: 'ui-inventory.linkedToMarcAuthority' })}
        >
          {({ ref, ariaIds }) => (
            <Link
              to={`/marc-authorities/authorities/${authorityId}?authRefType=Authorized&segment=search`}
              target="_blank"
              ref={ref}
              aria-labelledby={ariaIds.text}
              data-testid="authority-app-link"
            >
              <AppIcon
                size="small"
                app="marc-authorities"
                iconClassName={css.authorityIcon}
              />
            </Link>
          )}
        </Tooltip>
        {value}
      </>
    );
  }

  return value || <NoValue />;
};

ControllableDetail.propTypes = propTypes;

export default ControllableDetail;
