import { useStripes } from '@folio/stripes/core';

const withSingleRecordImport = (WrappedComponent) => {
  return (props) => {
    const stripes = useStripes();
    const canUseSingleRecordImport = stripes.hasInterface('copycat-imports')
      && stripes.hasInterface('data-import-converter-storage', '1.3')
      && stripes.hasPerm('ui-inventory.single-record-import');

    return <WrappedComponent
      {...props}
      canUseSingleRecordImport={canUseSingleRecordImport}
    />;
  };
};

export default withSingleRecordImport;
