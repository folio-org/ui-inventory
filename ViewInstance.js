import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';

import Pane from '@folio/stripes-components/lib/Pane';
import PaneMenu from '@folio/stripes-components/lib/PaneMenu';
import KeyValue from '@folio/stripes-components/lib/KeyValue';
import { Row, Col } from 'react-flexbox-grid';
import Icon from '@folio/stripes-components/lib/Icon';
import Layer from '@folio/stripes-components/lib/Layer';
import transitionToParams from '@folio/stripes-components/util/transitionToParams';

import utils from './utils';

import InstanceItems from './InstanceItems';
import InstanceForm from './InstanceForm';

const emptyObj = {};
const emptyArr = [];


class ViewInstance extends React.Component {

  static manifest = Object.freeze({
    selectedInstance: {
      type: 'okapi',
      path: 'instance-storage/instances/:{instanceid}',
      clear: false,
    },
    identifierTypes: {
      type: 'okapi',
      records: 'identifierTypes',
      path: 'identifier-types?limit=100',
    },
    creatorTypes: {
      type: 'okapi',
      records: 'creatorTypes',
      path: 'creator-types?limit=100',
    },
    contributorTypes: {
      type: 'okapi',
      records: 'contributorTypes',
      path: 'contributor-types?limit=100',
    },
  });

  constructor(props) {
    super(props);
    this.state = {
      accordions: {
        itemsAccordion: true,
      },
    };
    this.cInstanceItems = this.props.stripes.connect(InstanceItems);
  }

  // Edit Instance Handlers
  onClickEditInstance = (e) => {
    if (e) e.preventDefault();
    transitionToParams.bind(this)({ layer: 'edit' });
  }

  closeEditInstance = (e) => {
    if (e) e.preventDefault();
    utils.removeQueryParam('layer', this.props.location, this.props.history);
  }

  update(instance) {
    this.props.mutator.selectedInstance.PUT(instance).then(() => {
      this.closeEditInstance();
    });
  }

  handleAccordionToggle = ({ id }) => {
    this.setState((state) => {
      const newState = _.cloneDeep(state);
      newState.accordions[id] = !newState.accordions[id];
      return newState;
    });
  }

  render() {
    const { resources, match: { params: { instanceid } }, location } = this.props;
    const query = location.search ? queryString.parse(location.search) : emptyObj;
    const selectedInstance = (resources.selectedInstance || emptyObj).records || emptyArr;

    if (!selectedInstance || !instanceid) return <div />;
    const instance = selectedInstance.find(i => i.id === instanceid);
    const identifierTypes = (resources.identifierTypes || emptyObj).records || emptyArr;
    const creatorTypes = (resources.creatorTypes || emptyObj).records || emptyArr;
    const contributorTypes = (resources.contributorTypes || emptyObj).records || emptyArr;

    const detailMenu = <PaneMenu><button id="clickable-edit-instance" onClick={this.onClickEditInstance} title="Edit Instance"><Icon icon="edit" />Edit</button></PaneMenu>;

    return instance ? (
      <Pane defaultWidth={this.props.paneWidth} paneTitle={instance.title} lastMenu={detailMenu} dismissible onClose={this.props.onClose}>
        {'Fields in square brackets are placeholders for yet to be implemented properties'}
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
            <KeyValue label="Alternative Titles" value={_.get(instance, ['alternativeTitles'], []).join(', ')} />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <KeyValue label="Edition" value={_.get(instance, ['edition'], '')} />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <KeyValue label="Series Statement" value={_.get(instance, ['series'], '')} />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <KeyValue label="Identifiers" value={utils.identifiersFormatter(instance, identifierTypes)} />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <KeyValue label="Creators" value={utils.creatorsFormatter(instance, creatorTypes)} />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <KeyValue label="Contributors" value={utils.contributorsFormatter(instance, contributorTypes)} />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <KeyValue label="Subjects" value={_.get(instance, ['subjects'], []).join(', ')} />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <KeyValue label="Classification" value={_.get(instance, ['classification'], []).join(', ')} />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <KeyValue label="Publishers" value={utils.publishersFormatter(instance)} />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <KeyValue label="URLs" value={_.get(instance, ['urls'], '')} />
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
            <KeyValue label="Physical Descriptions" value={_.get(instance, ['physicalDescriptions'], '')} />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <KeyValue label="Languages" value={utils.languagesFormatter(instance)} />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <KeyValue label="Notes" value={_.get(instance, ['notes'], '')} />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <KeyValue label="[Date Added to FOLIO]" value={_.get(instance, ['metadata', 'createdDate'], '')} />
          </Col>
        </Row>
        <h3>Items</h3>
        <this.cInstanceItems
          accordionExpanded={this.state.accordions.itemsAccordion}
          accordionId="itemsAccordion"
          accordionToggle={this.handleAccordionToggle}
          {...this.props}
        />
        <br />
        <Layer isOpen={query.layer ? query.layer === 'edit' : false} label="Edit Instance Dialog">
          <InstanceForm
            onSubmit={(record) => { this.update(record); }}
            initialValues={instance}
            onCancel={this.closeEditInstance}
            identifierTypes={identifierTypes}
          />
        </Layer>
      </Pane>
    ) : null;
  }
}

ViewInstance.propTypes = {
  stripes: PropTypes.shape({
    connect: PropTypes.func.isRequired,
    locale: PropTypes.string.isRequired,
  }).isRequired,
  resources: PropTypes.shape({
    selectedInstance: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object),
    }),
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.object,
  }),
  location: PropTypes.object,
  history: PropTypes.object,
  mutator: PropTypes.shape({
    selectedInstance: PropTypes.shape({
      PUT: PropTypes.func.isRequired,
    }),
    editMode: PropTypes.shape({
      replace: PropTypes.func,
    }),
  }),
  onClose: PropTypes.func,
  paneWidth: PropTypes.string.isRequired,
};

export default ViewInstance;
