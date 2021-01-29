import React from 'react';
import PropTypes from 'prop-types';
import ky from 'ky';
import { stripesConnect, withOkapiKy, CalloutContext } from '@folio/stripes/core';
import { LoadingView } from '@folio/stripes/components';


class ImportRecord extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    stripes: PropTypes.shape({
      logger: PropTypes.object.isRequired,
    }).isRequired,
    resources: PropTypes.shape({
      query: PropTypes.shape({
        xid: PropTypes.string,
      }).isRequired,
    }).isRequired,
    mutator: PropTypes.shape({
      query: PropTypes.shape({
        update: PropTypes.func.isRequired,
      }).isRequired,
    }).isRequired,
    okapiKy: PropTypes.func.isRequired,
  };

  static contextType = CalloutContext;

  static manifest = Object.freeze({
    query: {},
  });

  constructor(props) {
    super(props);
    this.loading = false;
  }

  componentDidUpdate() {
    if (!this.loading) {
      const xid = this.props.resources.query?.xid;
      this.loading = true;
      this.loadExternalRecord(xid);
    }
  }

  loadExternalRecord = (xid) => {
    const { id } = this.props;

    this.props.okapiKy('copycat/imports', {
      timeout: 30000,
      method: 'POST',
      json: {
        externalIdentifier: xid,
        internalIdentifier: id,
        profileId: 'ae1f6118-4e89-4823-9b5b-16239861f234' // XXX hardwiring is bad
      },
    }).then(res => {
      // No need to check res.ok, as ky throws non-2xx responses
      res.json().then(json => {
        this.props.mutator.query.update({
          _path: `/inventory/view/${json.internalIdentifier}`,
          layer: undefined,
          xid: undefined,
        });
      });
      this.context.sendCallout({ message: `${id ? 'Updated' : 'Created'} record ${xid}` });
    }).catch(err => {
      this.props.mutator.query.update({
        _path: `/inventory${id ? `/view/${id}` : ''}`,
        layer: undefined,
        xid: undefined,
      });

      if (!(err instanceof ky.HTTPError)) {
        this.context.sendCallout({ type: 'error', message: `Something went wrong: ${err}` });
      } else {
        const res = err.response;
        res.text().then(text => {
          let detail = text;
          if (res.headers.get('content-type') === 'application/json') {
            const obj = JSON.parse(text);
            detail = obj.errors[0].message;
          }

          const message = `Something went wrong: ${err}: ${detail}`;
          this.props.stripes.logger.log('action', message);
          this.context.sendCallout({ type: 'error', message });
        });
      }
    });
  }

  render() {
    const { id } = this.props;
    this.props.stripes.logger.log('action', id ? `re-importing record ID ${this.props.id}` : 'importing new record');
    return <LoadingView />;
  }
}

export default withOkapiKy(stripesConnect(ImportRecord));
