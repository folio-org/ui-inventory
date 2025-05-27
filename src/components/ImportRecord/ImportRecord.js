import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import ky from 'ky';
import { withOkapiKy, CalloutContext } from '@folio/stripes/core';
import { LoadingView } from '@folio/stripes/components';
import { withLocation } from '../../hocs';


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
    const jobprofileid = this.props.getParams().jobprofileid;
    this.loadExternalRecord(xidtype, xid, jobprofileid);
  }

  loadExternalRecord = (xidtype, xid, jobprofileid) => {
    this.props.okapiKy('copycat/imports', {
      timeout: 30000,
      method: 'POST',
      json: {
        externalIdentifier: xid,
        internalIdentifier: this.props.id,
        profileId: xidtype,
        selectedJobProfileId: jobprofileid,
      },
    })
      .then(res => this.success(xid, res))
      .catch(err => this.failure(xid, err));
  }

  async success(xid, res) {
    const { id, updateLocation } = this.props;

    // No need to check res.ok, as ky throws non-2xx responses
    const json = await res.json();
    if (json.internalIdentifier) {
      // This SHOULD always be true, but in practice it sometimes is not
      const message = <FormattedMessage
        id={`ui-inventory.copycat.callout.${id ? 'updated' : 'created'}`}
        values={{ xid }}
      />;
      this.context.sendCallout({ message });
      updateLocation({
        _path: `/inventory/view/${json.internalIdentifier}`,
        layer: undefined,
        xid: undefined,
      }, { replace: true });
    } else {
      // No internalIdentifier returned => mod-copycat gave up polling
      const message = <FormattedMessage
        id={`ui-inventory.copycat.callout.no-id.${id ? 'updated' : 'created'}`}
        values={{ xid }}
      />;
      this.context.sendCallout({ type: 'warning', message });
      updateLocation({
        _path: `/inventory/view${id ? `/${id}` : ''}`,
        layer: undefined,
        xid: undefined,
      }, { replace: true });
    }
  }

  async failure(xid, err) {
    const { id, updateLocation, intl } = this.props;

    updateLocation({
      _path: `/inventory${id ? `/view/${id}` : ''}`,
      layer: undefined,
      xid: undefined,
    }, { replace: true });

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
