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
    const xid = this.props.getParams().xid;
    this.loadExternalRecord(xid);
  }

  loadExternalRecord = (xid) => {
    const { id, intl, updateLocation } = this.props;

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
        updateLocation({
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

export default withOkapiKy(injectIntl(withLocation(ImportRecord)));
