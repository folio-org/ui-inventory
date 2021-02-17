import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import ky from 'ky';
import { withOkapiKy, CalloutContext } from '@folio/stripes/core';
import { LoadingView } from '@folio/stripes/components';
import withLocation from '../../withLocation';


class ImportRecord extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    stripes: PropTypes.shape({
      logger: PropTypes.object.isRequired,
    }).isRequired,
    okapiKy: PropTypes.func.isRequired,
    intl: PropTypes.shape({
      formatMessage: PropTypes.func.isRequired,
    }).isRequired,
    getParams: PropTypes.func.isRequired,
    updateLocation: PropTypes.func.isRequired,
  };

  static contextType = CalloutContext;

  componentDidMount() {
    const xidtype = this.props.getParams().xidtype;
    const xid = this.props.getParams().xid;
    this.loadExternalRecord(xidtype, xid);
  }

  loadExternalRecord = (xidtype, xid) => {
    this.props.okapiKy('copycat/imports', {
      timeout: 30000,
      method: 'POST',
      json: {
        externalIdentifier: xid,
        internalIdentifier: this.props.id,
        profileId: xidtype,
      },
    })
      .then(res => this.success(xid, res))
      .catch(err => this.failure(xid, err));
  }

  async success(xid, res) {
    const { id, updateLocation } = this.props;

    // No need to check res.ok, as ky throws non-2xx responses
    const message = <FormattedMessage
      id={`ui-inventory.copycat.callout.${id ? 'updated' : 'created'}`}
      values={{ xid }}
    />;
    this.context.sendCallout({ message });

    const json = await res.json();
    let path = '/inventory/view';
    if (json.internalIdentifier) {
      // This SHOULD always be true, but in practice it sometimes is not
      path += `/${json.internalIdentifier}`;
    }

    updateLocation({
      _path: path,
      layer: undefined,
      xid: undefined,
    });
  }

  async failure(xid, err) {
    const { id, updateLocation, intl } = this.props;

    updateLocation({
      _path: `/inventory${id ? `/view/${id}` : ''}`,
      layer: undefined,
      xid: undefined,
    });

    if (!(err instanceof ky.HTTPError)) {
      const message = <FormattedMessage id="ui-inventory.copycat.callout.simpleError" values={{ err: err.toString() }} />;
      this.context.sendCallout({ timeout: 10000, type: 'error', message });
    } else {
      const res = err.response;
      const text = await res.text();

      let detail = text;
      if (res.headers.get('content-type') === 'application/json') {
        const obj = JSON.parse(text);
        detail = obj.errors[0].message;
      }

      const message = intl.formatMessage({ id: 'ui-inventory.copycat.callout.complexError' }, { err: err.toString(), detail });
      this.props.stripes.logger.log('action', message);
      this.context.sendCallout({ timeout: 10000, type: 'error', message });
    }
  }

  render() {
    const { id } = this.props;
    this.props.stripes.logger.log('action', id ? `re-importing record ID ${this.props.id}` : 'importing new record');
    return <LoadingView />;
  }
}

export default withOkapiKy(injectIntl(withLocation(ImportRecord)));
