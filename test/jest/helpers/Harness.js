import React from 'react';
import PropTypes from 'prop-types';
import { noop } from 'lodash';
import { IntlProvider } from 'react-intl';
import {
  QueryClientProvider,
  QueryClient,
} from 'react-query';

import { CalloutContext } from '@folio/stripes/core';

import translations from '../../../translations/ui-inventory/en';
import prefixKeys from './prefixKeys';

const client = new QueryClient();

const Harness = ({
  children,
  translations: translationsConfig,
}) => {
  const allTranslations = prefixKeys(translations);

  translationsConfig.forEach(tx => {
    Object.assign(allTranslations, prefixKeys(tx.translations, tx.prefix));
  });

  const defaultRichTextElements = ['b', 'i', 'em', 'strong', 'span', 'div', 'p', 'ul', 'ol', 'li', 'code'].reduce((res, Tag) => {
    res[Tag] = chunks => <Tag>{chunks}</Tag>;

    return res;
  }, {});

  return (
    <QueryClientProvider client={client}>
      <CalloutContext.Provider value={{ sendCallout: () => { } }}>
        <IntlProvider
          locale="en"
          key="en"
          timeZone="UTC"
          onWarn={noop}
          onError={noop}
          defaultRichTextElements={defaultRichTextElements}
          messages={allTranslations}
        >
          {children}
        </IntlProvider>
      </CalloutContext.Provider>
    </QueryClientProvider>
  );
};

Harness.propTypes = {
  children: PropTypes.node,
  translations: PropTypes.arrayOf(
    PropTypes.shape({
      prefix: PropTypes.string,
      translations: PropTypes.object,
    })
  ),
};

export default Harness;
