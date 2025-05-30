import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import PropTypes from 'prop-types';

import {
  Accordion,
  MultiColumnList,
  NoValue,
  TextLink,
} from '@folio/stripes/components';

import { checkIfArrayIsEmpty } from '../../../../utils';
import { wrappingCell } from '../../../../constants';

const visibleColumns = ['URL relationship', 'URI', 'Link text', 'Materials specified', 'URL public note'];
const columnWidths = {
  'URL relationship': '16%',
  'URI': '16%',
  'Link text': '16%',
  'Materials specified': '16%',
  'URL public note': '32%',
};

const ElectronicAccess = ({
  electronicAccess,
  refLookup,
  electronicAccessRelationships = [],
}) => {
  const intl = useIntl();

  const columnMapping = {
    'URL relationship': intl.formatMessage({ id: 'ui-inventory.URLrelationship' }),
    'URI': intl.formatMessage({ id: 'ui-inventory.uri' }),
    'Link text': intl.formatMessage({ id: 'ui-inventory.linkText' }),
    'Materials specified': intl.formatMessage({ id: 'ui-inventory.materialsSpecification' }),
    'URL public note': intl.formatMessage({ id: 'ui-inventory.urlPublicNote' }),
  };
  const electronicAccessFormatter = {
    'URL relationship': item => refLookup(electronicAccessRelationships, item.relationshipId)?.name || <NoValue />,
    'URI': item => {
      const uri = item.uri;

      return uri
        ? (
          <TextLink
            href={uri}
            rel="noreferrer noopener"
            target="_blank"
            style={wrappingCell}
          >
            {uri}
          </TextLink>
        )
        : <NoValue />;
    },
    'Link text': item => item.linkText || <NoValue />,
    'Materials specified': item => item.materialsSpecification || <NoValue />,
    'URL public note': item => item.publicNote || <NoValue />,
  };

  return (
    <Accordion
      id="acc08"
      label={<FormattedMessage id="ui-inventory.electronicAccess" />}
    >
      <MultiColumnList
        id="item-list-electronic-access"
        contentData={checkIfArrayIsEmpty(electronicAccess)}
        visibleColumns={visibleColumns}
        columnMapping={columnMapping}
        columnWidths={columnWidths}
        formatter={electronicAccessFormatter}
        ariaLabel={intl.formatMessage({ id: 'ui-inventory.electronicAccess' })}
      />
    </Accordion>
  );
};

ElectronicAccess.propTypes = {
  electronicAccess: PropTypes.arrayOf(PropTypes.object).isRequired,
  refLookup: PropTypes.func.isRequired,
  electronicAccessRelationships: PropTypes.arrayOf(PropTypes.object),
};

export default ElectronicAccess;
