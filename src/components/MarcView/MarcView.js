import React from 'react';
import PropTypes from 'prop-types';

import {
  Pane,
  Paneset,
  Headline,
} from '@folio/stripes/components';

import MarcField from './MarcField';

import styles from './MarcView.css';

const MarcView = ({
  paneTitle,
  marcTitle,
  marc,
  onClose,
}) => {
  return (
    <Paneset isRoot>
      <Pane
        paneTitle={paneTitle}
        defaultWidth="fill"
        dismissible
        onClose={onClose}
        data-test-instance-marc
      >
        <section className={styles.marcWrapper}>
          <Headline
            size="large"
            margin="small"
            tag="h3"
          >
            {marcTitle}
          </Headline>

          <table className={styles.marc}>
            <tbody>
              <tr data-test-instance-marc-field>
                <td colSpan="4">
                  {`LEADER ${marc.leader}`}
                </td>
              </tr>

              {
                marc.fields
                  .map((field, idx) => (
                    <MarcField
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

MarcView.propTypes = {
  marc: PropTypes.object.isRequired,
  marcTitle: PropTypes.node.isRequired,
  paneTitle: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.string,
  ]).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default MarcView;
