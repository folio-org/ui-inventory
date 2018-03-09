import React from 'react';
import PropTypes from 'prop-types';

import Paneset from '@folio/stripes-components/lib/Paneset';
import ConfirmationModal from '@folio/stripes-components/lib/structures/ConfirmationModal';
import Pane from '@folio/stripes-components/lib/Pane';
import EditableList from '@folio/stripes-components/lib/structures/EditableList';
import Callout from '@folio/stripes-components/lib/Callout';


class LoanTypesSettings extends React.Component {
  static propTypes = {
    // The stripes prop will probably get used eventually, so
    // it's probably best to leave it there.
    // eslint-disable-next-line
    stripes: PropTypes.shape({
      connect: PropTypes.func.isRequired,
    }).isRequired,
    resources: PropTypes.shape({
      loantypes: PropTypes.shape({
        records: PropTypes.arrayOf(PropTypes.object),
      }),
    }).isRequired,
    mutator: PropTypes.shape({
      activeRecord: PropTypes.shape({
        update: PropTypes.func,
      }),
      loantypes: PropTypes.shape({
        POST: PropTypes.func,
        PUT: PropTypes.func,
        DELETE: PropTypes.func,
      }),
    }).isRequired,
  };

  static manifest = Object.freeze({
    loantypes: {
      type: 'okapi',
      records: 'loantypes',
      path: 'loan-types',
      PUT: {
        path: 'loan-types/%{activeRecord.id}',
      },
      DELETE: {
        path: 'loan-types/%{activeRecord.id}',
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
    return this.props.mutator.loantypes.POST(type);
  }

  onUpdateType(type) {
    this.props.mutator.activeRecord.update({ id: type.id });
    return this.props.mutator.loantypes.PUT(type);
  }

  showCalloutMessage(name) {
    const message = (
      <span>
        The loan type <strong>{name.name}</strong> was successfully <strong>deleted</strong>.
      </span>
    );
    this.callout.sendCallout({ message });
  }

  onDeleteType() {
    const type = this.state.type;
    this.props.mutator.activeRecord.update({ id: type.id });
    return this.props.mutator.loantypes.DELETE(type)
      .then(() => this.deleteLoanTypeResolve())
      .then(() => this.showCalloutMessage(type))
      .catch(() => this.deleteLoanTypeReject())
      .finally(() => this.hideConfirm());
  }

  hideConfirm() {
    this.setState({
      confirming: false,
      type: {},
    });
  }

  showConfirm(typeId) {
    const type = this.props.resources.loantypes.records.find(t => t.id === typeId);
    this.setState({
      confirming: true,
      type,
    });

    this.deleteLoanTypePromise = new Promise((resolve, reject) => {
      this.deleteLoanTypeResolve = resolve;
      this.deleteLoanTypeReject = reject;
    });
    return this.deleteLoanTypePromise;
  }

  render() {
    if (!this.props.resources.loantypes) return <div />;

    const modalHeading = 'Delete loan type?';
    const modalMessage = <span>The loan type <strong>{this.state.type.name}</strong> will be <strong>deleted</strong></span>;
    const confirmLabel = 'Delete';

    return (
      <Paneset>
        <Pane defaultWidth="fill" fluidContentWidth paneTitle="Loan Types">
          <EditableList
            {...this.props}
            contentData={this.props.resources.loantypes.records || []}
            createButtonLabel="+ Add new"
            visibleFields={['name']}
            columnMapping={{ name: 'Loan Type' }}
            onCreate={this.onCreateType}
            onUpdate={this.onUpdateType}
            onDelete={this.showConfirm}
            isEmptyMessage="There are no loan types"
            nameKey="name"
            itemTemplate={{}}
            id="loantypes"
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

export default LoanTypesSettings;
