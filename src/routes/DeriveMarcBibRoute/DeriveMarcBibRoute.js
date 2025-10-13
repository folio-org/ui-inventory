import React, { useCallback } from 'react';
import ReactRouterPropTypes from 'react-router-prop-types';
import { FormattedMessage } from 'react-intl';

import { Pluggable } from '@folio/stripes/core';

const initialValues = {
  "_actionType": "view",
  "leader": "02871cas\\a2200769\\a\\4500",
  "fields": [
    {
      "tag": "001",
      "content": "cenin00000000013",
      "isProtected": true
    },
    {
      "tag": "005",
      "content": "20251013122618.5",
      "isProtected": false
    },
    {
      "tag": "008",
      "content": {
        "Type": "a",
        "BLvl": "s",
        "Entered": "951129",
        "DtSt": "d",
        "Date1": "1995",
        "Date2": "2002",
        "Ctry": "ctu",
        "Lang": "eng",
        "MRec": "\\",
        "Srce": "d",
        "Freq": "a",
        "Regl": "r",
        "SrTp": "\\",
        "Orig": "\\",
        "Form": "\\",
        "EntW": "\\",
        "Cont": [
          "\\",
          "\\",
          "\\"
        ],
        "GPub": "\\",
        "Conf": "0",
        "Alph": "a",
        "S/L": "0"
      },
      "isProtected": false
    },
    {
      "tag": "010",
      "content": "$a    96641993  $z sn 95029283 ",
      "indicators": [
        "\\",
        "\\"
      ],
      "isProtected": false
    },
    {
      "tag": "022",
      "content": "$a 1529-207X",
      "indicators": [
        "0",
        "\\"
      ],
      "isProtected": false
    },
    {
      "tag": "035",
      "content": "$a (OCoLC)33817441",
      "indicators": [
        "\\",
        "\\"
      ],
      "isProtected": false
    },
    {
      "tag": "035",
      "content": "$9 AHG8803AM",
      "indicators": [
        "\\",
        "\\"
      ],
      "isProtected": false
    },
    {
      "tag": "035",
      "content": "$a (amdb)1579144",
      "indicators": [
        "\\",
        "\\"
      ],
      "isProtected": false
    },
    {
      "tag": "037",
      "content": "$b JAI Press, Inc., 55 Old Post Rd., Greenwich, CT 06836",
      "indicators": [
        "\\",
        "\\"
      ],
      "isProtected": false
    },
    {
      "tag": "040",
      "content": "$a JNA $c JNA $d GUA $d DLC $d MYG $d IUL $d NSD $d GUA $d TXA $d UtOrBLW",
      "indicators": [
        "\\",
        "\\"
      ],
      "isProtected": false
    },
    {
      "tag": "049",
      "content": "$a TXAM",
      "indicators": [
        "\\",
        "\\"
      ],
      "isProtected": false
    },
    {
      "tag": "050",
      "content": "$a HF5657 $b .R47",
      "indicators": [
        "0",
        "0"
      ],
      "isProtected": false
    },
    {
      "tag": "082",
      "content": "$a 174/.9657/05 $2 20",
      "indicators": [
        "0",
        "0"
      ],
      "isProtected": false
    },
    {
      "tag": "210",
      "content": "$a Res. account. ethics",
      "indicators": [
        "0",
        "\\"
      ],
      "isProtected": false
    },
    {
      "tag": "222",
      "content": "$a Research on accounting ethics",
      "indicators": [
        "\\",
        "0"
      ],
      "isProtected": false
    },
    {
      "tag": "264",
      "content": "$a Greenwich, Conn. : $b JAI Press, $c ©1995-©2002.",
      "indicators": [
        "\\",
        "1"
      ],
      "isProtected": false
    },
    {
      "tag": "300",
      "content": "$a 8 volumes : $b illustrations ; $c 24 cm.",
      "indicators": [
        "\\",
        "\\"
      ],
      "isProtected": false
    },
    {
      "tag": "310",
      "content": "$a Annual",
      "indicators": [
        "\\",
        "\\"
      ],
      "isProtected": false
    },
    {
      "tag": "336",
      "content": "$a text $b txt $2 rdacontent",
      "indicators": [
        "\\",
        "\\"
      ],
      "isProtected": false
    },
    {
      "tag": "337",
      "content": "$a unmediated $b n $2 rdamedia",
      "indicators": [
        "\\",
        "\\"
      ],
      "isProtected": false
    },
    {
      "tag": "338",
      "content": "$a volume $b nc $2 rdacarrier",
      "indicators": [
        "\\",
        "\\"
      ],
      "isProtected": false
    },
    {
      "tag": "362",
      "content": "$a Vol. 1 (1995)-v. 8 (2002).",
      "indicators": [
        "0",
        "\\"
      ],
      "isProtected": false
    },
    {
      "tag": "650",
      "content": "$a Accounting $x Moral and ethical aspects $v Periodicals.",
      "indicators": [
        "\\",
        "0"
      ],
      "isProtected": false
    },
    {
      "tag": "650",
      "content": "$a Auditing $x Moral and ethical aspects $v Periodicals.",
      "indicators": [
        "\\",
        "0"
      ],
      "isProtected": false
    },
    {
      "tag": "650",
      "content": "$a Accountants $x Professional ethics $v Periodicals.",
      "indicators": [
        "\\",
        "0"
      ],
      "isProtected": false
    },
    {
      "tag": "650",
      "content": "$a Auditors $x Professional ethics $v Periodicals.",
      "indicators": [
        "\\",
        "0"
      ],
      "isProtected": false
    },
    {
      "tag": "785",
      "content": "$t Research on professional responsibility and ethics in accounting $x 1574-0765 $w (DLC)  2005263038 $w (OCoLC)56726372",
      "indicators": [
        "0",
        "0"
      ],
      "isProtected": false
    },
    {
      "tag": "850",
      "content": "$a DLC $a GU $a InU",
      "indicators": [
        "\\",
        "\\"
      ],
      "isProtected": false
    },
    {
      "tag": "891",
      "content": "$9 853 $8 1 $a v. $i (year) $w u",
      "indicators": [
        "2",
        "0"
      ],
      "isProtected": false
    },
    {
      "tag": "891",
      "content": "$9 863 $8 1.1 $a <7> $i <2000>",
      "indicators": [
        "4",
        "1"
      ],
      "isProtected": false
    },
    {
      "tag": "022",
      "content": "$a 1612-166X $9 0071-1128 $2 6",
      "indicators": [
        "0",
        "\\"
      ],
      "isProtected": false
    },
    {
      "tag": "029",
      "content": "$a NZ1 $b 6222887",
      "indicators": [
        "1",
        "\\"
      ],
      "isProtected": false
    },
    {
      "tag": "029",
      "content": "$a AU@ $b 000022590279",
      "indicators": [
        "1",
        "\\"
      ],
      "isProtected": false
    },
    {
      "tag": "035",
      "content": "$a (OCoLC)38301807",
      "indicators": [
        "\\",
        "\\"
      ],
      "isProtected": false
    },
    {
      "tag": "035",
      "content": "$9 AHD2223AM",
      "indicators": [
        "\\",
        "\\"
      ],
      "isProtected": false
    },
    {
      "tag": "042",
      "content": "$a lcd",
      "indicators": [
        "\\",
        "\\"
      ],
      "isProtected": false
    },
    {
      "tag": "049",
      "content": "$a TXAM",
      "indicators": [
        "\\",
        "\\"
      ],
      "isProtected": false
    },
    {
      "tag": "050",
      "content": "$a QH98 $b .E7",
      "indicators": [
        "1",
        "4"
      ],
      "isProtected": false
    },
    {
      "tag": "070",
      "content": "$a QH98 $b .A38",
      "indicators": [
        "0",
        "\\"
      ],
      "isProtected": false
    },
    {
      "tag": "072",
      "content": "$a M500",
      "indicators": [
        "\\",
        "0"
      ],
      "isProtected": false
    },
    {
      "tag": "210",
      "content": "$a Adv. limnol. $b (1995)",
      "indicators": [
        "0",
        "\\"
      ],
      "isProtected": false
    },
    {
      "tag": "222",
      "content": "$a Advances in limnology $b (1995)",
      "indicators": [
        "\\",
        "0"
      ],
      "isProtected": false
    },
    {
      "tag": "245",
      "content": "$a Advances in limnology. create pre-edited 42 to derive",
      "indicators": [
        "0",
        "0"
      ],
      "isProtected": false
    },
    {
      "tag": "246",
      "content": "$a Ergebnisse der Limnologie",
      "indicators": [
        "1",
        "3"
      ],
      "isProtected": false
    },
    {
      "tag": "264",
      "content": "$a Stuttgart : $b E. Schweizerbart'sche Verlagsbuchhandlung, $c 1995-",
      "indicators": [
        "\\",
        "1"
      ],
      "isProtected": false
    },
    {
      "tag": "300",
      "content": "$a volumes : $b illustrations ; $c 25 cm.",
      "indicators": [
        "\\",
        "\\"
      ],
      "isProtected": false
    },
    {
      "tag": "310",
      "content": "$a Irregular",
      "indicators": [
        "\\",
        "\\"
      ],
      "isProtected": false
    },
    {
      "tag": "336",
      "content": "$a text $b txt $2 rdacontent",
      "indicators": [
        "\\",
        "\\"
      ],
      "isProtected": false
    },
    {
      "tag": "337",
      "content": "$a unmediated $b n $2 rdamedia",
      "indicators": [
        "\\",
        "\\"
      ],
      "isProtected": false
    },
    {
      "tag": "338",
      "content": "$a volume $b nc $2 rdacarrier",
      "indicators": [
        "\\",
        "\\"
      ],
      "isProtected": false
    },
    {
      "tag": "362",
      "content": "$a 45-",
      "indicators": [
        "0",
        "\\"
      ],
      "isProtected": false
    },
    {
      "tag": "490",
      "content": "$a 1995-2005: Archiv für Hydrobiologie. Special issues",
      "indicators": [
        "1",
        "\\"
      ],
      "isProtected": false
    },
    {
      "tag": "490",
      "content": "$a 2007- : Fundamental and applied limnology. Special issues",
      "indicators": [
        "1",
        "\\"
      ],
      "isProtected": false
    },
    {
      "tag": "500",
      "content": "$a Latest issue consulted: 60, published in 2007.",
      "indicators": [
        "\\",
        "\\"
      ],
      "isProtected": false
    },
    {
      "tag": "550",
      "content": "$a Issued by: International Association of Theoretical and Applied Limnology.",
      "indicators": [
        "\\",
        "\\"
      ],
      "isProtected": false
    },
    {
      "tag": "650",
      "content": "$a Limnology.",
      "indicators": [
        "\\",
        "0"
      ],
      "isProtected": false
    },
    {
      "tag": "710",
      "content": "$a International Association of Theoretical and Applied Limnology.",
      "indicators": [
        "2",
        "\\"
      ],
      "isProtected": false
    },
    {
      "tag": "780",
      "content": "$t Ergebnisse der Limnologie $x 0071-1128 $w (DLC)   65087342 $w (OCoLC)1568178",
      "indicators": [
        "0",
        "0"
      ],
      "isProtected": false
    },
    {
      "tag": "830",
      "content": "$a Archiv für Hydrobiologie. $p Special issues.",
      "indicators": [
        "\\",
        "0"
      ],
      "isProtected": false
    },
    {
      "tag": "830",
      "content": "$a Fundamental and applied limnology. $p Special issues.",
      "indicators": [
        "\\",
        "0"
      ],
      "isProtected": false
    },
    {
      "tag": "850",
      "content": "$a DNAL",
      "indicators": [
        "\\",
        "\\"
      ],
      "isProtected": false
    },
    {
      "tag": "999",
      "content": "$i 37df609a-9aeb-4bcd-acb4-6922f8fbddc7 $s a7b51ebe-43bc-4479-907f-08931dea7d2e",
      "indicators": [
        "f",
        "f"
      ],
      "isProtected": true
    }
  ],
  "suppressDiscovery": false,
  "marcFormat": "BIBLIOGRAPHIC",
  "sourceVersion": 5,
  "parsedRecordId": "9ca69edb-f23a-4e5d-9316-eaf60e38014e",
  "parsedRecordDtoId": "a7b51ebe-43bc-4479-907f-08931dea7d2e",
  "externalId": "37df609a-9aeb-4bcd-acb4-6922f8fbddc7",
  "externalHrid": "cenin00000000013",
  "updateInfo": {
    "recordState": "ACTUAL",
    "updateDate": "2025-10-13T12:26:18.815Z",
    "updatedBy": {
      "userId": "7fc25d9e-c798-42f7-bcee-f0029fc3ec9a",
      "username": "consortium_admin",
      "lastName": "ADMINISTRATOR",
      "firstName": "Consortium_admin"
    }
  }
};

export const DeriveMarcBibRoute = ({ match, history, location }) => {
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

  const onCreateAndKeepEditing = useCallback((id) => {
    history.push(`/inventory/quick-marc/edit-bibliographic/${id}`);
  }, []);

  return (
    <div data-test-inventory-quick-marc>
      <Pluggable
        type="quick-marc"
        basePath={match.path}
        onClose={onClose}
        onSave={onClose}
        onCreateAndKeepEditing={onCreateAndKeepEditing}
        externalRecordPath="/inventory/view"
        action="derive"
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

DeriveMarcBibRoute.propTypes = {
  match: ReactRouterPropTypes.match.isRequired,
  history: ReactRouterPropTypes.match.isRequired,
  location: ReactRouterPropTypes.match.isRequired,
};
