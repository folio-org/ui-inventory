import { useRef } from 'react';
import PropTypes from 'prop-types';
import { ConflictDetectionBanner } from '@folio/stripes/components';

const OptimisticLockingBanner = ({ latestVersionLink }) => {
  const conflictDetectionBannerRef = useRef(null);
  const focusConflictDetectionBanner = () => conflictDetectionBannerRef.current.focus();

  return (
    <ConflictDetectionBanner
      latestVersionLink={latestVersionLink}
      conflictDetectionBannerRef={conflictDetectionBannerRef}
      focusConflictDetectionBanner={focusConflictDetectionBanner}
    />
  );
};

OptimisticLockingBanner.propTypes = {
  latestVersionLink: PropTypes.string
};

export default OptimisticLockingBanner;
