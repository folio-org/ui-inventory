import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
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
    intl: PropTypes.shape({
      formatMessage: PropTypes.func.isRequired,
    }).isRequired,
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
    const { id, intl } = this.props;

    this.props.okapiKy('copycat/imports', {
      timeout: 30000,
      method: 'POST',
      json: {
        externalIdentifier: xid,
        internalIdentifier: id,
        profileId: 'f26df83c-aa25-40b6-876e-96852c3d4fd4' // XXX hardwired to UUID in mod-copycat reference data
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
      const message = <FormattedMessage
        id={`ui-inventory.copycat.callout.${id ? 'updated' : 'created'}`}
        values={{ xid }}
      />;
      this.context.sendCallout({ message });
    }).catch(err => {
      this.props.mutator.query.update({
        _path: `/inventory${id ? `/view/${id}` : ''}`,
        layer: undefined,
        xid: undefined,
      });

      if (!(err instanceof ky.HTTPError)) {
        const message = <FormattedMessage id="ui-inventory.copycat.callout.simpleError" values={{ err: err.toString() }} />;
        this.context.sendCallout({ timeout: 10000, type: 'error', message });
      } else {
        const res = err.response;
        res.text().then(text => {
          let detail = text;
          if (res.headers.get('content-type') === 'application/json') {
            const obj = JSON.parse(text);
            detail = obj.errors[0].message;
          }

          const message = intl.formatMessage({ id: 'ui-inventory.copycat.callout.complexError' }, { err: err.toString(), detail });
          this.props.stripes.logger.log('action', message);
          this.context.sendCallout({ timeout: 10000, type: 'error', message });
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

export default withOkapiKy(stripesConnect(injectIntl(ImportRecord)));
