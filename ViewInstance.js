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

import Holdings from './Holdings';
import InstanceForm from './edit/InstanceForm';

const emptyObj = {};
const emptyArr = [];


class ViewInstance extends React.Component {

  static manifest = Object.freeze({
    selectedInstance: {
      type: 'okapi',
      path: 'instance-storage/instances/:{instanceid}',
      clear: false,
    },
  });

  constructor(props) {
    super(props);
    this.state = {
      accordions: {
        itemsAccordion: true,
        holdingsAccordion: true,
      },
    };
    this.cHoldings = this.props.stripes.connect(Holdings);
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
    const { resources, match: { params: { instanceid } }, location,
            referenceTables, stripes, onCopy } = this.props;
    const query = location.search ? queryString.parse(location.search) : emptyObj;
    const selectedInstance = (resources.selectedInstance || emptyObj).records || emptyArr;

    if (!selectedInstance || !instanceid) return <div />;
    const instance = selectedInstance.find(i => i.id === instanceid);

    const detailMenu = (
      <PaneMenu>
        <button id="clickable-copy-instance" onClick={() => onCopy(instance)} title="Copy Instance"><Icon icon="duplicate" />Copy</button>
        <button id="clickable-edit-instance" onClick={this.onClickEditInstance} title="Edit Instance"><Icon icon="edit" />Edit</button>
      </PaneMenu>
    );

    return instance ? (
      <Pane
        defaultWidth={this.props.paneWidth}
        paneTitle={
          <div style={{ textAlign: 'center' }}>
            <strong>{instance.title}</strong>
            {(instance.publication && instance.publication.length > 0) &&
              <div>
                <em>{instance.publication[0].publisher}{instance.publication[0].dateOfPublication ? `, ${instance.publication[0].dateOfPublication}` : ''}</em>
              </div>
            }
          </div>
        }
        lastMenu={detailMenu}
        dismissible
        onClose={this.props.onClose}
      >
        <Row>
          <Col xs={12}>
            <KeyValue label="FOLIO ID" value={_.get(instance, ['id'], '')} />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <KeyValue label="Metadata source" value="TBA" />
          </Col>
        </Row>
        { (instance.identifiers.length > 0) &&
          <Row>
            <Col xs={12}>
              <KeyValue label="Resource identifier" value={utils.identifiersFormatter(instance, referenceTables.identifierTypes)} />
            </Col>
          </Row>
        }
        { (instance.instanceFormatId) &&
          <Row>
            <Col xs={12}>
              <KeyValue label="Format" value={utils.instanceFormatsFormatter(instance, referenceTables.instanceFormats)} />
            </Col>
          </Row>
        }
        <Row>
          <Col xs={12}>
            <KeyValue label="Resource title" value={_.get(instance, ['title'], '')} />
          </Col>
        </Row>
        { (instance.alternativeTitles.length > 0) &&
          <Row>
            <Col xs={12}>
              <KeyValue label="Alternative titles" value={_.get(instance, ['alternativeTitles'], []).map((title, i) => <div key={i}>{title}</div>)} />
            </Col>
          </Row>
        }
        { (instance.contributors.length > 0) &&
          <Row>
            <Col xs={12}>
              <KeyValue label="Contributor" value={utils.contributorsFormatter(instance, referenceTables.contributorTypes)} />
            </Col>
          </Row>
        }
        { (instance.publication.length > 0) &&
          <Row>
            <Col xs={12}>
              <KeyValue label="Publisher" value={utils.publishersFormatter(instance)} />
            </Col>
          </Row>
        }
        <Row>
          <Col xs={12}>
            <KeyValue label="Resource type" value={utils.instanceTypesFormatter(instance, referenceTables.instanceTypes)} />
          </Col>
        </Row>
        { (instance.physicalDescriptions.length > 0) &&
          <Row>
            <Col xs={12}>
              <KeyValue label="Physical description" value={_.get(instance, ['physicalDescriptions'], []).map((desc, i) => <div key={i}>{desc}</div>)} />
            </Col>
          </Row>
        }
        { (instance.languages.length > 0) &&
          <Row>
            <Col xs={12}>
              <KeyValue label="Language" value={utils.languagesFormatter(instance)} />
            </Col>
          </Row>
        }
        { (instance.subjects.length > 0) &&
          <Row>
            <Col xs={12}>
              <KeyValue label="Subject headings" value={_.get(instance, ['subjects'], []).map((sub, i) => <div key={i}>{sub}</div>)} />
            </Col>
          </Row>
        }
        { (instance.classifications.length > 0) &&
          <Row>
            <Col xs={12}>
              <KeyValue label="Classification" value={utils.classificationsFormatter(instance, referenceTables.classificationTypes)} />
            </Col>
          </Row>
        }
        { (instance.notes.length > 0) &&
          <Row>
            <Col xs={12}>
              <KeyValue label="Notes" value={_.get(instance, ['notes'], []).map((note, i) => <div key={i}>{note}</div>)} />
            </Col>
          </Row>
        }

        { (!!instance.edition) &&
          <Row>
            <Col xs={12}>
              <KeyValue label="Edition" value={_.get(instance, ['edition'], '')} />
            </Col>
          </Row>
        }
        { (instance.series.length > 0) &&
          <Row>
            <Col xs={12}>
              <KeyValue label="Series Statement" value={_.get(instance, ['series'], '')} />
            </Col>
          </Row>
        }
        { (instance.urls.length > 0) &&
          <Row>
            <Col xs={12}>
              <KeyValue label="URLs" value={_.get(instance, ['urls'], []).map((url, i) => <div key={i}>{url}</div>)} />
            </Col>
          </Row>
        }
        <h3>Holdings</h3>
        <this.cHoldings
          dataKey={instanceid}
          id={instanceid}
          accordionExpanded={this.state.accordions.holdingsAccordion}
          accordionId="holdingsAccordion"
          accordionToggle={this.handleAccordionToggle}
          instance={instance}
          referenceTables={referenceTables}
          match={this.props.match}
          stripes={stripes}
          location={location}
        />
        <br />
        <Layer isOpen={query.layer ? query.layer === 'edit' : false} label="Edit Instance Dialog">
          <InstanceForm
            onSubmit={(record) => { this.update(record); }}
            initialValues={instance}
            onCancel={this.closeEditInstance}
            referenceTables={referenceTables}
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
  referenceTables: PropTypes.object.isRequired,
  mutator: PropTypes.shape({
    selectedInstance: PropTypes.shape({
      PUT: PropTypes.func.isRequired,
    }),
    editMode: PropTypes.shape({
      replace: PropTypes.func,
    }),
  }),
  onClose: PropTypes.func,
  onCopy: PropTypes.func,
  paneWidth: PropTypes.string.isRequired,
};

export default ViewInstance;
