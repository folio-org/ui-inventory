import React, { useCallback } from 'react';
import ReactRouterPropTypes from 'react-router-prop-types';
import { FormattedMessage } from 'react-intl';

import { Pluggable } from '@folio/stripes/core';

const initialValues = {
  "_actionType": "view",
  "leader": "00250naa\\a2200085uu\\4500",
  "fields": [
    {
      "tag": "001",
      "content": "in00000000020",
      "isProtected": true
    },
    {
      "tag": "005",
      "content": "20251020110216.7",
      "isProtected": false
    },
    {
      "tag": "008",
      "content": {
        "Type": "a",
        "BLvl": "a",
        "Entered": "251020",
        "DtSt": "|",
        "Date1": "\\\\\\\\",
        "Date2": "\\\\\\\\",
        "Ctry": "\\\\\\",
        "Lang": "\\\\\\",
        "MRec": "\\",
        "Srce": "\\",
        "Ills": [
          "\\",
          "\\",
          "\\",
          "\\"
        ],
        "Audn": "\\",
        "Form": "\\",
        "Cont": [
          "\\",
          "\\",
          "\\",
          "\\"
        ],
        "GPub": "\\",
        "Conf": "|",
        "Fest": "|",
        "Indx": "|",
        "LitF": "|",
        "Biog": "\\"
      },
      "isProtected": false
    },
    {
      "tag": "245",
      "content": "$a bib test pre-edited",
      "indicators": [
        "\\",
        "\\"
      ],
      "isProtected": false
    },
    {
      "tag": "999",
      "content": "$i 583bcdab-cea7-4986-b62e-f7e5eacd185e $s b17ec15e-ad50-47de-bbf8-f8df5c6f2ab1",
      "indicators": [
        "f",
        "f"
      ],
      "isProtected": true
    }
  ],
  "suppressDiscovery": false,
  "marcFormat": "BIBLIOGRAPHIC",
  "sourceVersion": 0,
  "parsedRecordId": "b17ec15e-ad50-47de-bbf8-f8df5c6f2ab1",
  "parsedRecordDtoId": "b17ec15e-ad50-47de-bbf8-f8df5c6f2ab1",
  "externalId": "583bcdab-cea7-4986-b62e-f7e5eacd185e",
  "externalHrid": "in00000000020",
  "updateInfo": {
    "recordState": "ACTUAL",
    "updateDate": "2025-10-20T11:02:16.964Z",
    "updatedBy": {
      "userId": "a270a0d5-0188-4bcd-b664-4f0b367ddd87",
      "username": "consortium_admin",
      "lastName": "ADMINISTRATOR",
      "firstName": "Consortium_admin"
    }
  }
};

export const EditMarcBibRoute = ({ match, history, location }) => {
  const { externalId } = match.params;

  const searchParams = new URLSearchParams(location.search);

  const onClose = useCallback((recordRoute) => {
    const newSearchParams = new URLSearchParams(location.search);
    newSearchParams.delete('relatedRecordVersion');
    newSearchParams.delete('shared');

    history.push({
      pathname: `/inventory/view/${recordRoute ?? ''}`,
      search: newSearchParams.toString(),
      state: {
        isClosingFocused: true,
      },
    });
  }, [location.search]);

  return (
    <div data-test-inventory-quick-marc>
      <Pluggable
        type="quick-marc"
        basePath={match.path}
        onClose={onClose}
        onSave={onClose}
        externalRecordPath="/inventory/view"
        action="edit"
        marcType="bibliographic"
        externalId={externalId}
        isShared={searchParams.get('shared')}
        useRoutes={false}
        initialValues={initialValues}
        
      >
        <span data-test-inventory-quick-marc-no-plugin>
          <FormattedMessage id="ui-inventory.quickMarcNotAvailable" />
        </span>
      </Pluggable>
    </div>
  );
};

EditMarcBibRoute.propTypes = {
  match: ReactRouterPropTypes.match.isRequired,
  history: ReactRouterPropTypes.match.isRequired,
  location: ReactRouterPropTypes.match.isRequired,
};
