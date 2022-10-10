import React from 'react';
import PropTypes from 'prop-types';
import { EntryManager } from '@folio/stripes/smart-components';
import TargetProfileDetail from './TargetProfileDetail';
import TargetProfileForm from './TargetProfileForm';


class TargetProfiles extends React.Component {
  static manifest = Object.freeze({
    entries: {
      type: 'okapi',
      records: 'profiles',
      path: 'copycat/profiles',
      resourceShouldRefresh: true,
      GET: {
        path: 'copycat/profiles?query=cql.allRecords=1&limit=1000',
      },
    },
  });

  static propTypes = {
    label: PropTypes.node.isRequired,
    resources: PropTypes.shape({
      entries: PropTypes.shape({
        records: PropTypes.arrayOf(PropTypes.object),
      }).isRequired,
    }).isRequired,
    mutator: PropTypes.shape({
      entries: PropTypes.shape({
        POST: PropTypes.func,
        PUT: PropTypes.func,
        DELETE: PropTypes.func,
      }).isRequired,
    }).isRequired,
  };

  render() {
    const entryList = ((this.props.resources.entries || {}).records || [])
      .map(entry => ({ ...entry, displayName: `${entry.enabled ? '✓' : '✕'} ${entry.name}` }));

    return (
      <EntryManager
        {...this.props}
        parentMutator={this.props.mutator}
        parentResources={this.props.resources}
        entryList={entryList}
        detailComponent={TargetProfileDetail}
        paneTitle={this.props.label}
        entryLabel={this.props.label}
        entryFormComponent={TargetProfileForm}
        nameKey="displayName"
        permissions={{
          put: 'ui-inventory.single-record-import',
          post: 'ui-inventory.single-record-import',
          delete: 'ui-inventory.single-record-import',
          /*
          // Once these are defined
          put: 'ui-inventory.single-record-import.create',
          post: 'ui-inventory.single-record-import.update',
          delete: 'ui-inventory.single-record-import.delete',
          */
        }}
      />
    );
  }
}

export default TargetProfiles;
