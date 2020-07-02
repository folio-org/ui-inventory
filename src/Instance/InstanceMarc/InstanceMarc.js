import React, { useMemo } from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';

import {
  Pane,
  Paneset,
  Headline,
} from '@folio/stripes/components';

import InstanceMarcField from './InstanceMarcField';
import {
  isControlField,
} from './utils';
import styles from './InstanceMarc.css';

const InstanceMarc = ({
  instance,
  marc,
  onClose,
}) => {
  const intl = useIntl();

  const renderFields = useMemo(() => ([
    ...marc.fields.filter(isControlField),
    ...marc.fields.filter(field => !isControlField(field)),
  ]), [marc]);

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
            {intl.formatMessage({ id: 'ui-inventory.marcSourceRecord' })}
          </Headline>

          <table className={styles.instanceMarc}>
            <tbody>
              <tr data-test-instance-marc-field>
                <td colSpan="4">
                  {`LEADER ${marc.leader}`}
                </td>
              </tr>

              {
                renderFields
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
