import React from 'react';
import PropTypes from 'prop-types';

import Paneset from '@folio/stripes-components/lib/Paneset';
import ConfirmationModal from '@folio/stripes-components/lib/structures/ConfirmationModal';
import Pane from '@folio/stripes-components/lib/Pane';
import EditableList from '@folio/stripes-components/lib/structures/EditableList';
import Callout from '@folio/stripes-components/lib/Callout';


class MaterialTypesSettings extends React.Component {
  static propTypes = {
    // The stripes prop will probably get used eventually, so
    // it's probably best to leave it there.
    // eslint-disable-next-line
    stripes: PropTypes.shape({
      connect: PropTypes.func.isRequired,
    }).isRequired,
    resources: PropTypes.shape({
      materialtypes: PropTypes.shape({
        records: PropTypes.arrayOf(PropTypes.object),
      }),
    }).isRequired,
    mutator: PropTypes.shape({
      activeRecord: PropTypes.shape({
        update: PropTypes.func,
      }),
      materialtypes: PropTypes.shape({
        POST: PropTypes.func,
        PUT: PropTypes.func,
        DELETE: PropTypes.func,
      }),
    }).isRequired,
  };

  static manifest = Object.freeze({
    materialtypes: {
      type: 'okapi',
      records: 'mtypes',
      path: 'material-types',
      PUT: {
        path: 'material-types/%{activeRecord.id}',
      },
      DELETE: {
        path: 'material-types/%{activeRecord.id}',
      },
    },
    activeRecord: {},
  });

  constructor(props) {
    super(props);
    this.state = {
      confirming: false,
      type: {},
    };
    this.onCreateType = this.onCreateType.bind(this);
    this.onUpdateType = this.onUpdateType.bind(this);
    this.onDeleteType = this.onDeleteType.bind(this);
    this.showConfirm = this.showConfirm.bind(this);
    this.hideConfirm = this.hideConfirm.bind(this);
    this.callout = null;
  }

  onCreateType(type) {
    return this.props.mutator.materialtypes.POST(type);
  }

  onUpdateType(type) {
    this.props.mutator.activeRecord.update({ id: type.id });
    return this.props.mutator.materialtypes.PUT(type);
  }

  showCalloutMessage(name) {
    const message = (
      <span>
        The material type <strong>{name.name}</strong> was successfully <strong>deleted</strong>.
      </span>
    );
    this.callout.sendCallout({ message });
  }

  onDeleteType() {
    const type = this.state.type;
    this.props.mutator.activeRecord.update({ id: type.id });
    return this.props.mutator.materialtypes.DELETE(type)
      .then(() => this.deleteMaterialTypeResolve())
      .then(() => this.showCalloutMessage(type))
      .catch(() => this.deleteMaterialTypeReject())
      .finally(() => this.hideConfirm());
  }

  hideConfirm() {
    this.setState({
      confirming: false,
      type: {},
    });
  }

  showConfirm(typeId) {
    const type = this.props.resources.materialtypes.records.find(t => t.id === typeId);
    this.setState({
      confirming: true,
      type,
    });

    this.deleteMaterialTypePromise = new Promise((resolve, reject) => {
      this.deleteMaterialTypeResolve = resolve;
      this.deleteMaterialTypeReject = reject;
    });
    return this.deleteMaterialTypePromise;
  }

  render() {
    if (!this.props.resources.materialtypes) return <div />;

    const modalHeading = 'Delete material type?';
    const modalMessage = <span>The material type <strong>{this.state.type.name}</strong> will be <strong>deleted</strong></span>;
    const confirmLabel = 'Delete';

    return (
      <Paneset>
        <Pane defaultWidth="fill" fluidContentWidth paneTitle="Material Types">
          <EditableList
            {...this.props}
            // TODO: not sure why we need this OR if there are no groups
            // Seems to load this once before the groups data from the manifest
            // is pulled in. This still causes a JS warning, but not an error
            contentData={this.props.resources.materialtypes.records || []}
            createButtonLabel="+ Add new"
            visibleFields={['name']}
            columnMapping={{ name: 'Material Type' }}
            onCreate={this.onCreateType}
            onUpdate={this.onUpdateType}
            onDelete={this.showConfirm}
            isEmptyMessage="There are no material types"
            nameKey="name"
            itemTemplate={{}}
            id="materialtypes"
          />
          <ConfirmationModal
            open={this.state.confirming}
            heading={modalHeading}
            message={modalMessage}
            onConfirm={this.onDeleteType}
            onCancel={this.hideConfirm}
            confirmLabel={confirmLabel}
          />
          <Callout ref={(ref) => { this.callout = ref; }} />
        </Pane>
      </Paneset>
    );
  }
}

export default MaterialTypesSettings;
