import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import {
  Pane,
  Paneset,
  Headline,
} from '@folio/stripes/components';

import InstanceMarcField from './InstanceMarcField';
import styles from './InstanceMarc.css';

const InstanceMarc = ({
  instance,
  marc,
  onClose,
}) => {
  return (
    <Paneset isRoot>
      <Pane
        paneTitle={instance.title}
        defaultWidth="fill"
        dismissible
        onClose={onClose}
        data-test-instance-marc
      >
        <section className={styles.instanceMarcWrapper}>
          <Headline
            size="large"
            margin="small"
            tag="h3"
          >
            <FormattedMessage id="ui-inventory.marcSourceRecord" />
          </Headline>

          <table className={styles.instanceMarc}>
            <tbody>
              <tr data-test-instance-marc-field>
                <td colSpan="4">
                  {`LEADER ${marc.leader}`}
                </td>
              </tr>

              {
                marc.fields
                  .map((field, idx) => (
                    <InstanceMarcField
                      field={field}
                      key={idx}
                    />
                  ))
              }
            </tbody>
          </table>
        </section>
      </Pane>
    </Paneset>
  );
};

InstanceMarc.propTypes = {
  instance: PropTypes.object.isRequired,
  marc: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default InstanceMarc;
