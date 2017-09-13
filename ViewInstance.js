import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import Pane from '@folio/stripes-components/lib/Pane';
import PaneMenu from '@folio/stripes-components/lib/PaneMenu';
import KeyValue from '@folio/stripes-components/lib/KeyValue';
import { Row, Col } from 'react-flexbox-grid';
import Icon from '@folio/stripes-components/lib/Icon';
import Layer from '@folio/stripes-components/lib/Layer';

import InstanceForm from './InstanceForm';
import utils from './utils';

const emptyObj = {};
const emptyArr = [];


class ViewInstance extends React.Component {

  static manifest = Object.freeze({
    editMode: { initialValue: { mode: false } },
    selectedInstance: {
      type: 'okapi',
      path: 'inventory/instances/:{instanceid}',
      clear: false,
    },
  });

  /*
   * Helper function for displaying property names in the instance view. Given
   * a 'property' array of { id: x, name: y } entries, returns the name
   * corresponding to the specified id.
  */
  static propNameForId(id, property) {
    if (!id || !property) {
      return '';
    } else if (property.length > 0) {
      return _.find(property, { id }).name;
    }

    return id;
  }

  // Edit Instance Handlers
  onClickEditInstance = (e) => {
    if (e) e.preventDefault();
    this.props.mutator.editMode.replace({ mode: true });
  }

  closeEditInstance = (e) => {
    if (e) e.preventDefault();
    this.props.mutator.editMode.replace({ mode: false });
  }

  update(instance) {
    this.props.mutator.selectedInstance.PUT(instance).then(() => {
      this.closeEditInstance();
    });
  }

  render() {
    const detailMenu = <PaneMenu><button id="clickable-edit-instance" onClick={this.onClickEditInstance} title="Edit Instance"><Icon icon="edit" />Edit</button></PaneMenu>;

    const { resources, match: { params: { instanceid } } } = this.props;
    const selectedInstance = (resources.selectedInstance || emptyObj).records || emptyArr;

    if (!selectedInstance || !instanceid) return <div />;
    const instance = selectedInstance.find(i => i.id === instanceid);

    return instance ? (
      <Pane defaultWidth={this.props.paneWidth} paneTitle={instance.title} lastMenu={detailMenu} dismissible onClose={this.props.onClose}>
        {"Fields in square brackets are placeholders for yet to be implemented properties"}
        <Row>
          <Col xs={12}>
            <KeyValue label="FOLIO ID" value={_.get(instance, ['id'], '')} />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <KeyValue label="Title" value={_.get(instance, ['title'], '')} />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <KeyValue label="[Alternative Title(s)]" value={_.get(instance, ['alternativeTitles'], '')} />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <KeyValue label="[Edition]" value={_.get(instance, ['edition'], '')} />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <KeyValue label="[Series Statement]" value={_.get(instance, ['series'], '')} />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <KeyValue label="Identifiers" value={utils.identifiersFormatter(instance)} />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <KeyValue label="[Creator(s)]" value={_.get(instance, ['creators'], '')} />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <KeyValue label="[Contributor(s)]" value={_.get(instance, ['contributors'], '')} />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <KeyValue label="[Publisher(s)]" value={_.get(instance, ['publishers'], '')} />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <KeyValue label="[Place(s) of Publication]" value={_.get(instance, ['placesOfPublication'], '')} />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <KeyValue label="[Publication Date(s)]" value={_.get(instance, ['placesOfPublication'], '')} />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <KeyValue label="[URL(s)]" value={_.get(instance, ['urls'], '')} />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <KeyValue label="[Resource Type]" value={_.get(instance, ['resourceType'], '')} />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <KeyValue label="[Format]" value={_.get(instance, ['format'], '')} />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <KeyValue label="[Physical Description(s)]" value={_.get(instance, ['physicalDescriptions'], '')} />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <KeyValue label="[Language(s)]" value={_.get(instance, ['languages'], '')} />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <KeyValue label="[Notes]" value={_.get(instance, ['notes'], '')} />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <KeyValue label="[Date Added to FOLIO]" value={_.get(instance, ['metadata','createdDate'], '')} />
          </Col>
        </Row>


        <br />
        <Layer isOpen={this.props.resources.editMode ? this.props.resources.editMode.mode : false} label="Edit Instance Dialog">
          <InstanceForm
            onSubmit={(record) => { this.update(record); }}
            initialValues={instance}
            onCancel={this.closeEditInstance}
          />
        </Layer>
      </Pane>
    ) : null;
  }
}

ViewInstance.propTypes = {
  resources: PropTypes.shape({
    selectedInstance: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object),
    }),
    editMode: PropTypes.shape({
      mode: PropTypes.bool,
    }),
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.object,
  }),
  mutator: React.PropTypes.shape({
    selectedInstance: React.PropTypes.shape({
      PUT: React.PropTypes.func.isRequired,
    }),
    editMode: PropTypes.shape({
      replace: PropTypes.func,
    }),
  }),
  onClose: PropTypes.func,
  paneWidth: PropTypes.string.isRequired,
};

export default ViewInstance;
