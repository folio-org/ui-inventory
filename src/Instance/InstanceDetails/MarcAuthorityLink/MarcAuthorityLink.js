import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import { AppIcon } from '@folio/stripes/core';
import { Tooltip } from '@folio/stripes/components';

import css from './MarcAuthorityLink.css';

const propTypes = {
  authorityId: PropTypes.string.isRequired,
  children: PropTypes.node,
};

const MarcAuthorityLink = ({ authorityId, children }) => {
  const intl = useIntl();

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
      {children}
    </>
  );
};

MarcAuthorityLink.propTypes = propTypes;

export default MarcAuthorityLink;
