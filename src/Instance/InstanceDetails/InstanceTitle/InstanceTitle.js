import React, { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import {
  AppIcon,
} from '@folio/stripes/core';
import {
  Row,
  Col,
  Layout,
  Headline,
} from '@folio/stripes/components';

import css from './InstanceTitle.css';

const InstanceTitle = ({
  instance = {},
  instanceTypes = [],
}) => {
  const instanceTypeName = useMemo(() => {
    return instanceTypes.find(instanceType => instanceType.id === instance.instanceTypeId)?.name;
  }, [instance, instanceTypes]);

  const layoutClassNames = classNames(
    'display-flex flex-align-items-center padding-bottom-gutter flex-wrap--wrap',
    css.hasBorderTop,
    css.hasPaddings,
  );

  return (
    <>
      <Row>
        <Col xs={12}>
          <Layout className={layoutClassNames}>
            <Layout className="margin-end-gutter display-flex flex-align-items-center">
              <AppIcon
                app="inventory"
                iconKey="instance"
                size="small"
              >
                <FormattedMessage
                  id="ui-inventory.instanceRecordWithType"
                  values={{ instanceTypeName }}
                />
              </AppIcon>
            </Layout>
          </Layout>
        </Col>
      </Row>

      <Row>
        <Col xs={12}>
          <Headline
            data-test-headline-medium
            size="medium"
            margin="medium"
          >
            {instance.title}
          </Headline>
        </Col>
      </Row>
    </>
  );
};

InstanceTitle.propTypes = {
  instance: PropTypes.object,
  instanceTypes: PropTypes.arrayOf(PropTypes.object),
};

export default InstanceTitle;
