import React from 'react';
import PropTypes from 'prop-types';

import Layer from '@folio/stripes-components/lib/Layer';

import ItemForm from './edit/items/ItemForm';

class ViewItem extends React.Component {


  static manifest = Object.freeze({
    items: {
      type: 'okapi',
      path: 'item-storage/items/:{itemid}',
    },
    selectedHoldingsRecord: {
      type: 'okapi',
      path: 'holdings-storage/holdings/:{holdingsrecordid}',
    },
    selectedInstance: {
      type: 'okapi',
      path: 'instance-storage/instances/:{instanceid}',
    },
    shelfLocations: {
      type: 'okapi',
      records: 'shelflocations',
      path: 'shelf-locations',
    },
    materialTypes: {
      type: 'okapi',
      path: 'material-types',
      records: 'mtypes',
    },
    loanTypes: {
      type: 'okapi',
      path: 'loan-types',
      records: 'loantypes',
    },
  });

  constructor(props) {
    super(props);
  }

  onClickCloseEditItem = (e) => {
    if (e) e.preventDefault();
    this.props.history.push(`/inventory/view/${this.props.match.params.instanceid}`);
  }

  updateItem = (item) => {
    this.props.mutator.items.PUT(item).then(() => {
      this.onClickCloseEditItem();
    });
  }

  render() {
    const { resources: { items, selectedHoldingsRecord, selectedInstance, shelfLocations, materialTypes, loanTypes },
            match: { params: { itemid } },
            referenceTables } = this.props;
    const selInstance = (selectedInstance || {}).records || [];
    const selItem = (items || {}).records || [];
    const selHoldingsRecord = (selectedHoldingsRecord || {}).records || [];
    referenceTables.shelfLocations = (shelfLocations || {}).records || [];
    referenceTables.loanTypes = (loanTypes || {}).records || [];
    referenceTables.materialTypes = (materialTypes || {}).records || [];

    if (!selItem.length || !selHoldingsRecord.length || !selInstance.length) return <div>No resources</div>;
    return (
      <Layer isOpen label="Edit Item Dialog">
        <ItemForm
          form={`itemform_${itemid}`}
          id={itemid}
          key={itemid}
          initialValues={selItem[0]}
          onCancel={this.onClickCloseEditItem}
          onSubmit={(record) => { this.updateItem(record); }}
          referenceTables={referenceTables}
          holdingsRecord={selHoldingsRecord[0]}
          instance={selInstance[0]}
        />
      </Layer>
    );
  }
}

ViewItem.propTypes = {
  resources: PropTypes.shape({
    selectedInstance: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object),
    }),
    materialTypes: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object),
    }),
    loanTypes: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object),
    }),
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.object,
  }),
  history: PropTypes.object,
  referenceTables: PropTypes.object.isRequired,
  mutator: PropTypes.shape({
    items: PropTypes.shape({
      PUT: PropTypes.func.isRequired,
    }),
  }),
};

export default ViewItem;
