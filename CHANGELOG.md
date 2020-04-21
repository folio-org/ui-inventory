# Change history for ui-inventory

## [2.1.0] IN PROGRESS
* Display instance status date with status. Refs UIIN-1007.
* Import `stripes-util` via `stripes`. Fixes UIIN-1021 and UIIN-1029.
* Add CQL query report generation to search instances. UIDEXP-13 and UIDEXP-2
* Add validation for notes in inventory, holdings, item forms. Refs UIIN-994.
* Use correct operator when searching by item status and hrid. Fixes UIIN-1048, UIIN-1051, UIIN-1052, UIIN-1053.
* Add ability to mark item as withdrawn. Refs UIIN-817.
* Register `instanceFormatIds` filter. Fixes UIIN-1057.
* Add filter for instance date created. Refs UIIN-788.
* Improve `buildOptionalBooleanQuery` performance by using `cql.allRecords=1` and `==` operator. Fixes UIIN-1064.
* Make the title element required for preceding and succeeding titles. Fixes UIIN-1033 and UIIN-1034.
* Display item status date with status. Refs UIIN-984.
* Add ability to search by `ISBN, normalized` option. Refs UIIN-647.
* Instance. Remove The New button. Refs UIIN-1023.
* Instance. Remove The Edit pen icon in the top pane. Refs UIIN-1024.
* New/Edit Instance Record: Move Save button to fixed footer component Refs UIIN-915.
* New/Edit Holding Record: Move Save button to fixed footer component Refs UIIN-916.
* New/Edit Item Record: Move Save button to fixed footer component. Refs UIIN-917.
* Add missing location permissions to `ui-inventory.instance.view`. Fixes UIIN-1056.
* Item. Remove The Edit pen icon in the top main pane. Fixes UIIN-1026.
* Holdings. Remove The Edit pen icon in the top main pane. Fixes UIIN-1025.

## [2.0.0](https://github.com/folio-org/ui-inventory/tree/v2.0.0) (2020-03-17)
[Full Changelog](https://github.com/folio-org/ui-inventory/compare/v1.13.1...v2.0.0)

* Increase number of digits for HRID settings page. Refs UIIN-904
* Add warning modal to HRID settings page. Refs UIIN-861
* Fix display of information when the item's status is "Missing". Refs UIIN-913.
* Add filter for instance formats. Refs UIIN-820.
* Create permission for Inventory -> Settings -> HRID handling. Fix Inventory -> Settings -> pages access depending on the patron's permissions. Refs UIIN-800.
* Move the Cancel/Save buttons to the bottom of the Inventory HRID settings screen. Refs UIIN-929.
* Support updated versions of mod-circulation, mod-inventory, and mod-item-storage. Refs UIIN-936.
* Add remaining call number fields in transit report. Refs UIIN-925.
* Add ability to search by Instance HRID (Instance segment). Refs UIIN-899.
* Add saving instances UIIDs of the inventory search result to csv file. Refs UIDEXP-1.
* Add ability to search by Item HRID (Item segment). Refs UIIN-901.
* Add ability to search by Holdings HRID (Holdings segment). Refs UIIN-900.
* Disable saving instances UIIDs option if there are not items in search result. Refs UIDEXP-12.
* Retrieve up to 2000 statistical codes. Refs UIIN-819.
* Retrieve up to 1000 material types on the item-edit screen. Refs UIIN-946.
* Always retrieve fresh statistical-code-types in settings. Refs UIIN-949.
* Replace deprecated babel dependencies. Refs UIIN-956, STCOR-381.
* Fix display of marc fields on ViewMarc screen. Refs UIIN-980.
* Add filter for modes of issuance. Refs UIIN-823.
* Add "Volume" and "Year, caption" fields to the Instance record in a detailed view. Refs UIIN-954.
* Fix search and filter pane when viewing a holdings record. Fixes UIIN-953.
* Fix translation for "Awaiting delivery" item status. Fixes UIIN-976.
* Use correct requester and proxy name on user's form. Fixes UIREQ-413.
* Extract item view into a separate route. Fixes UIIN-955.
* Filter instance, holding and item records by suppress: No. Refs UIIN-967, UIIN-968, UIIN-969, UIIN-970.
* Filter instance by nature of content. Refs UIIN-824.
* Omit Former holdings ID when copying holdings record. Refs UIIN-845.
* Filter instance by "Call number, eye readable" via holdings segment. Refs UIIN-858.
* Filter instance by "Call number, eye readable" via items segment. Refs UIIN-990.
* Enhance preceding connected titles. Refs UIIN-960.
* Add Save icon to the Save Instances UUIDs option in Action menu. UIDEXP-32.
* Display succeeding/preceding titles on instance view. Refs UIIN-952, UIIN-961 and UIIN-964.
* Rename the filter `Effective location` to `Effective location (item)`. Refs UIIN-1008.
* Change endpoint to request instances UIIDs for report generation. UIDEXP-28.
* Migrate to `stripes` `v3.0.0` and move `react-intl` to peerDependencies.
* Add new options with icons to action menu - `Export instances (MARC)` and `Export instances (JSON)`. UIDEXP-33.
* Add support for unconnected preceding titles. Refs UIIN-950.
* Add support for connected and connected succeeding titles. Refs UIIN-962 and UIIN-963.
* Add `parse` to `discoverySuppress` and `staffSuppress` filters. Refs STCOM-654.
* Display the value in the 'Nature of content' field instead of the UUID. Fixes UIIN-1022.

## [1.13.1](https://github.com/folio-org/ui-inventory/tree/v1.13.1) (2019-12-11)
[Full Changelog](https://github.com/folio-org/ui-inventory/compare/v1.13.0...v1.13.1)

* Create one common inventory permission "Inventory: All permissions". Refs UIIN-739.
* Refactor Resource Type filter on instances segment. Part of UIIN-193.
* In transit report: check in fields. Refs UIIN-883.
* Fix holdings note field widths. Fixes UIIN-882.
* Show most recent check in on item record. Refs UIIN-749.

## [1.13.0](https://github.com/folio-org/ui-inventory/tree/v1.13.0) (2019-12-04)
[Full Changelog](https://github.com/folio-org/ui-inventory/compare/v1.12.1...v1.13.0)

* Added iconAlignment "baseline" for <AppIcon>'s in the results list (UIIN-719)
* Increase limit for holdings to 1000. Refs UIIN-723.
* Set default title for items without barcode. Refs UIIN-731.
* Fix modal title when assigning a temporary location. Fixes UIIN-681
* Add query param to new request url. Part of UIIN-773.
* Update language filter to support ISO-639 format. Part of UIIN-735.
* Add permissions for holdings records. Refs UIIN-699, UIIN-702, UIIN-707
* Align the UX display of notes in the Holdings record. Refs UIIN-738.
* Fix truncation for local Resource identifier value. Refs UIIN-784
* Remove "+" plus signs from buttons. Refs UIIN-529.
* Show confirmation toast when click on the copy icon. Refs UIIN-720
* Align display of data in the instance record. Refs UIIN-677.
* Align display of data in the holdings record. Refs UIIN-811.
* Fix double asterisk in accordion Instance relationships (analytics and bound-with). Fixes UIIN-646
* Make headings of the item list in the Holdings accordion sortable. Refs UIIN-812
* Display Resource identifier types in alphabetic order in detailed view. Refs UIIN-705.
* Display Classification identifier types in alphabetic order in detailed view. Refs UIIN-706.
* Implement preceding and succeeding title fields in instance record. Completes UIIN-809 and UIIN-810.
* Make sure the label of Nature of content is presented on its own line. Refs UIIN-748.
* Add segmented control panel for search. Part of UIIN-758.
* Move the Acquisition accordion down in the record. Refs of UIIN-808.
* Move holdings-record accordion to top of instance display. Refs UIIN-802.
* Fix display of statistical codes. Fixes UIIN-796.
* Link to requests by item-id since barcode may not always be present. Fixes UIIN-821.
* Update the display of list of Instance notes. Refs UIIN-643.
* Update the display of list of Series statements. Refs UIIN-642.
* Update the display of list of Subject headings. Refs UIIN-815.
* Add enumeration and chronology data to the item table on the instance record. Refs UIIN-757.
* Add filters for staffSuppress and discoverySuppress. Completes UIIN-289.
* Display suppress from discovery in the item record view. Fixes UIIN-825.
* Instance record. Display empty elements with the dashes. Refs UIIN-826.
* Filter item records by material type. Part of UIIN-777.
* Fix wrapping cells in Electronic access table. Refs UIIN-414.
* Fix checkbox on holdings edit page. Refs of UIIN-843.
* Filter item records by item status. Part of UIIN-771.
* Allow for searching title with words out of order. Part of UIIN-602.
* Item record. Display empty elements with the dashes. Refs UIIN-828.
* Filter holdings pane by discovery-suppress. Completes UIIN-766.
* Filter holdings and item panes by discovery-suppress. Completes UIIN-766 and UIIN-767.
* Filter holdings and item panes by holdings perm location. Completes UIIN-679.
* Holding record. Display empty elements with the dashes. Refs UIIN-827.
* Add ability to search by cql from item segment. Parf of UIIN-869.
* Add ability to search by cql from holding segment. Parf of UIIN-868.
* Add support for new search segments in `ViewInstance` route. UIIN-859.
* Change instance all/keyword search to use new `keyword` index. Completes UIIN-717.
* Filter all panes by item effective location. Completes UIIN-199.
* Display "status updated" date/time. Completes UIIN-846.
* Add new item status date field support. Completes UIIN-486.
* Add search options to holdings segment. Part of UIIN-848.
* Reorder and relabel instance search options. Completes UIIN-847 and UIIN-838.
* Reorder item search options. Completes UIIN-849.
* Instance record's item-record columns should not be clipped. Refs UIIN-865.
* Display effective location at top of item record. Completes UIIN-863.
* Display complete call number in holdings headers. Completes UIIN-884.
* Use instance url with the correct search segment. Fixes UIIN-886.
* Display effective call number string at the top of the item record. Fixes UIIN-750.

## [1.12.1](https://github.com/folio-org/ui-inventory/tree/v1.12.1) (2019-09-26)
[Full Changelog](https://github.com/folio-org/ui-inventory/compare/v1.12.0...v1.12.1)

* Correctly import `<Field>` in `StatisticalCodeSettings`. Refs UIIN-725
* Create Inventory settings page for HRID handling. Refs UIIN-741

## [1.12.0](https://github.com/folio-org/ui-inventory/tree/v1.12.0) (2019-09-12)
[Full Changelog](https://github.com/folio-org/ui-inventory/compare/v1.11.1...v1.12.0)

* Relabel notes accordions. Fixes UIIN-632, UIIN-633, UIIN-634.
* Fix bug in alternative title validation. Fixes UIIN-558.
* Refactor forms to use final form. Part of UIIN-668.
* Don't present static tables as interactive. Refs UIIN-643.
* Refactor item's copy number to a single field. Part of UIIN-653.
* Fix bug affecting display of warning messages in settings. Fixes UIIN-627.
* Preserve holdings record checkbox state. Fixes UIIN-667.
* Fix notes selector on item create form. Fixes UIIN-669.
* Add ability to copy item's barcode to clipboard. Fixes UIIN-177.
* Fix bug in deselection of temporary location in holdings. Fixes UIIN-686.
* Add nature of content field to instance record. Completes UIIN-470.
* Show damage status value from the lookup table, instead of the raw id. Refs UIIN-683.
* Set source to 'FOLIO' when duplicating instance records. Completes UIIN-711.
* Allow unassigning of temporary loan type in items. Fixes UIIN-696.

## [1.11.1](https://github.com/folio-org/ui-inventory/tree/v1.11.1) (2019-07-26)
[Full Changelog](https://github.com/folio-org/ui-inventory/compare/v1.11.0...v1.11.1)

* Bug fix: Do not send optional FKs as empty strings; omit them. Refs UIIN-655.
* Fix/update integration tests (UIIN-654, UIIN-655, UIIN-656)
* Dissallow edit of instance.contributors.primary from UI when MARC exists. UIIN-650.

## [1.11.0](https://github.com/folio-org/ui-inventory/tree/v1.11.0) (2019-07-24)
[Full Changelog](https://github.com/folio-org/ui-inventory/compare/v1.10.0...v1.11.0)

* Requires `inventory` interface 9.0
* Requires `instance-storage` interface 7.0
* Requires `instance-note-types` interface 1.0
* Requires `nature-of-content-terms` interface 1.0
* Requires `identifier-types` interface 1.1
* Requires `contributor-name-types` interface 1.2
* Requires `classification-types` interface 1.1
* Fix item details retaining loan data for closed loan. Part of UIIN-484.
* Do not attempt to manually set the read-only HRID field in tests. Refs UIIN-557.
* Remove unnecessary permissions. Refs UIORG-150.
* Populate item damage status select list. Set timestamp. UIIN-458
* Use new array-search syntax for identifiers, contributors. Fixes UIIN-618, UIIN-621, UIIN-623, UIIN-624.
* Adapt to change structure of instance notes. UIIN-452.
* Protect certain instance fields from editing when MARC record exists. UIIN-592.
* Change series format. Part of UIIN-606.
* Mark contributor name field as required. Part of UIIN-620.
* Always show metadata. Fixes UIIN-626.
* Display Item damage status data. Fixes UIIN-651.
* Add settings page, instance note types. UIIN-461.
* Add settings page, nature of content. UIIN-471.
* Add settings page, resource identifiers. UIIN-483.
* Add settings page, classification types. UIIN-505.
* Add settings page, modes of issuance. UIIN-508.
* Other bug fixes. UIIN-484, UIIN-567, UIIN-559, UIIN-603, UIIN-614, UIIN-616, UIIN-652.

## [1.10.0](https://github.com/folio-org/ui-inventory/tree/v1.10.0) (2019-06-14)
[Full Changelog](https://github.com/folio-org/ui-inventory/compare/v1.9.0...v1.10.0)

* Add link to MARC record source from SRS. UIIN-590.
* Handle display order of Statistical codes different in instance edit dropdown. UIIN-573.

## [1.9.0](https://github.com/folio-org/ui-inventory/tree/v1.9.0) (2019-06-12)
[Full Changelog](https://github.com/folio-org/ui-inventory/compare/v1.8.0...v1.9.0)

* Check for dependencies when deleting holding record. Part of UIIN-550.
* Update notes checkbox to render label vertically in item and holdings forms (UIIN-559)
* Show link to request for items without barcode. UIREQ-253.
* Layout of primary contributor flag. UIIN-503.
* Settings pages for note types. UIIN-453.
* Bug fixes: UIIN-568, UIIN-427
* Remove results display by default (no search queries or filters). UIIN-79
* Handle spelling issue for ILL policies. UIIN-516
* Change accordion header value to Condition. Fix UIIN-576
* Add validation to alternative title. Fixes UIIN-496.
* Replace hardcoded translations of search indexes by formatted messages. Fixes UIIN-595
* `Save` buttons are labeled consistently with other apps. Refs UIIN-530.

## [1.8.0](https://github.com/folio-org/ui-inventory/tree/v1.8.0) (2019-05-10)
[Full Changelog](https://github.com/folio-org/ui-inventory/compare/v1.7.0...v1.8.0)

* New icons for Instance, Holdings, Items. UIIN-133.
* Retrieve 1000 items from lookup tables. Refs UIIN-413.
* Fix alphabetical order of lookup tables. Fixes UIIN-421.
* Don't append wildcards to search terms. Fixes UIIN-481.
* Provide the correct a11y props to `<Layer>`s.
* Use item id instead of barcode when creating new request. UIREQ-253.
* Add missing order-by clauses to item-record lookup tables. Fixes UIIN-522.
* Send `contributors.type.primary` as correct type. Refs MODINV-117.
* Add ability to search by barcode. Part of UIIN-143.
* Move acquisitions items to the acquisitions accordion. Fixes UIIN-506.
* Holdings and Item record. Relabel acquisition fields. UIIN-507.
* Remove duplicate asterisks from required fields. Fixes UIIN-490.
* Add ability to mark Paged items as missing. Part of UIIN-555.
* Mark In process items as missing. Part of UIIN-560.
* Item records, delete confirmation modal. UIIN-335.
* Item record deletes, check dependencies in other modules. UIIN-534.
* Holdings records, delete confirmation modal. UIIN-334.
* Align menu item labels across pages. UIIN-524.
* Fixes to language inconsistencies. UIIN-521.
* Other bug fixes: UIIN-432, UIIN-479, UIIN-510, UIIN-513, UIIN-536, UIIN-556
* Add missing validation for some CV items.

## [1.7.0](https://github.com/folio-org/ui-inventory/tree/v1.7.0) (2019-03-15)
[Full Changelog](https://github.com/folio-org/ui-inventory/compare/v1.6.0...v1.7.0)

* Supports `circulation` interface 7.0 UIIN-491
* Update BigTest interactors to reflect MCL aria changes. Refs STRIPES-597.
* Move `AppIcon` import to `@folio/stripes/core`. Refs STCOM-411.
* Update integration tests to accommodate MCL aria changes. Fixes UIIN-474.
* Bug-fixes: Action menu not closing (UIIN-488), pieces descriptions missing (UIIN-447), subheadings missing (UIIN-416), pop-up not closing (UIIN-488), cannot create new item (UIIN-497), double asterisks on mandatory fields (UIIN-493), items attached to wrong holdings records (UIIN-492), missing select lists (UIIN-456), check boxes not updating right (UIIN-417)
* Include "Open - In transit" when accessing requests from item record (UIIN-358)

## [1.6.0](https://github.com/folio-org/ui-inventory/tree/v1.6.0) (2019-01-25)
[Full Changelog](https://github.com/folio-org/ui-inventory/compare/v1.5.0...v1.6.0)

* Create new request from item record. Fixes UIIN-410.
* Correctly show instance-edit checkbox status. Fixes UIIN-417.
* Don't copy HRID on duplicating records, disable editing of HRID. UIIN-431, UIIN-450.
* Upgrade to stripes v2.0.0.

## [1.5.1](https://github.com/folio-org/ui-inventory/tree/v1.5.1) (2018-12-17)
[Full Changelog](https://github.com/folio-org/ui-inventory/compare/v1.5.0...v1.5.1)

* Fix null pointer bug (UIIN-412)

## [1.5.0](https://github.com/folio-org/ui-inventory/tree/v1.5.0) (2018-12-14)
[Full Changelog](https://github.com/folio-org/ui-inventory/compare/v1.4.0...v1.5.0)

* Requires `locations` interface 3.0
* Requires `inventory` interface 8.0
* Requires `instance-storage` interface 6.0
* Requires `holdings-storage` interface 3.0
* Requires `item-storage` interface 7.0
* Requires `item-note-types` interface 1.0
* Requires `statistical-codes` interface 1.0
* Requires `alternative-title-types` interface 1.0
* Requires `holdings-types` interface 1.0
* Requires `call-number-types` interface 1.0
* Requires `electronic-access-relationships` interface 1.0
* Requires `ill-policies` interface 1.0
* Requires `holdings-note-types` interface 1.0
* Requires `circulation` interface 4.0 5.0
* Renames `pieceIdentifiers`to `copyNumbers` (UIIN-397)
* Adapts to changed structure of alternative titles (UIIN-345)
* Adapts to changed structure of holdings statements (UIIN-234)
* No longer requires `platforms` interface (UIIN-388)
* Add accordions to views and forms for instance, holdings, item (UIIN-166 UIIN-168, UIIN-170, UIIN-273, UIIN-274, UIIN-275, UIIN-298)
* Add settings pages for controlled vocabularies: electronic access types, statistical code types, alternative title types, instance status types, holdings types, ILL policies, call number types, statistical codes (UIIN-301, UIIN-302, UIIN-362, UIIN-374, UIIN-376, UIIN-377, UIIN-378, UIIN-385)
* Extend holdings record - view and form (UIIN-232, UIIN-233, UIIN-234, UIIN-235, UIIN-236, UIIN-238, UIIN-386)
* Extend instance record - view and form (UIIN-328, UIIN-342, UIIN-343, UIIN-344, UIIN-345, UIIN-348, UIIN-364, UIIN-366, UIIN-367)
* Extend item record - view and form (UIIN-239, UIIN-250, UIIN-251, UIIN-253, UIIN-256)
* Display 'FOLIO' for 'Metadata source' whenever there is no 'sourceRecordFormat' (UIIN-353)
* Fix `craftLayerUrl()` loading state (FOLIO-1547)
* Replace `formatDateTime()` with `<FormattedTime>` (STCOR-267)
* Click "search" button in tests (STCOM-354)
* Provide `sortby` key for `<ControlledVocab>`. Refs STSMACOM-139.
* Default term to empty string in cases when query is undefined. Fixes UIIN-371.
* Support circulation v5.0, requiring service-point information on loans. Refs UIIN-383.
* Removed deprecated actionMenuItems-prop. Fixes UIIN-393.
* Display of item information in Inventory for items with no open loans (UIIN-409)

## [1.4.0](https://github.com/folio-org/ui-inventory/tree/v1.4.0) (2018-10-05)
[Full Changelog](https://github.com/folio-org/ui-inventory/compare/v1.3.0...v1.4.0)

* Remove `instance.instanceFormatId`, add `instance.instanceFormatIds` (UIIN-330)
* Fix case-sensitive tests. Fixes UIIN-329.
* Add electronic access relationship reference data (UIIN-316)
* Requires: `inventory` interface (7.0) and `instance-storage` interface (5.0) (UIIN-316)
* Remove notes helper app (STRIPES-558)
* Copy `craftLayerUrl()` from `stripes-components` (Part of FOLIO-1547)
* Add dependency to stripes v1.0.0 to package.json. (Part of FOLIO-1547)

## [1.3.0](https://github.com/folio-org/ui-inventory/tree/v1.3.0) (2018-09-27)
[Full Changelog](https://github.com/folio-org/ui-inventory/compare/v1.2.1...v1.3.0)

* Remove `instance.urls` from Instance form (UIIN-303)
* Make HRID optional in Instance form (UIIN-304)
* Validate HRID for uniqueness in Instance form (UIIN-288)
* Update `stripes-form` dependency to v1.0.0
* Remove cataloging level (UIIN-312)
* Remove API dependency on `cataloging-levels` (UIIN-312)
* More stable inventory-search tests. Refs UIIN-306.
* Remove `instance.edition` add `instance.editions` (UIIN-299)
* Move files into src directory

## [1.2.3 (hot fix)](https://github.com/folio-org/ui-inventory/tree/v1.2.3) (2018-09-19)
[Full Changelog](https://github.com/folio-org/ui-inventory/compare/v1.2.2...v1.2.3)

* More stable inventory-search tests. Refs UIIN-306.

## [1.2.2 (hot fix)](https://github.com/folio-org/ui-inventory/tree/v1.2.2) (2018-09-14)
[Full Changelog](https://github.com/folio-org/ui-inventory/compare/v1.2.1...v1.2.2)

* Update to stripes-form 0.9.0. Refs STRIPES-555.

## [1.2.1 (hot fix)](https://github.com/folio-org/ui-inventory/tree/v1.2.1) (2018-09-13)
[Full Changelog](https://github.com/folio-org/ui-inventory/compare/v1.2.0...v1.2.1)

* Update regression test following introduction of required `hrid` (UIIN-290)

## [1.2.0](https://github.com/folio-org/ui-inventory/tree/v1.2.0) (2018-09-13)
[Full Changelog](https://github.com/folio-org/ui-inventory/compare/v1.1.1...v1.2.0)

* Add API dependencies `statistical-code-types` 1.0, `cataloging-levels` 1.0, `modes-of-issuance` 1.0, `instance-statuses` 1.0
* Update API dependencies `inventory` 6.4, `instance-storage` 4.6
* Add preliminary display of Instance relationships (UIIN-145)
* Upgrade Okapi dependencies for Instance relationships, inventory: 6.3, instance-storage 4.5, instance-relationship-types 1.0 (UIIN-145)
* Update Okapi dependency, circulation: 3.0 4.0
* Add properties publisher role, publication frequency, publication range to Instance details, form (UIIN-227)
* Add properties HRID, instance status, date status updated, cataloged date, previously held, staff suppress, discovery suppress, mode of issuance, cataloging level to Instance details and/or form (UIIN-223)
* Add electronic access properties to Instance details and form (UIIN-229)

## [1.1.1](https://github.com/folio-org/ui-inventory/tree/v1.1.1) (2018-09-06)
[Full Changelog](https://github.com/folio-org/ui-inventory/compare/v1.1.0...v1.1.1)

* Fix toggle accordion feature after new accordions added. (UIIN-279)
* Update dependency on eslint-config-stripes (UIIN-280)
* Update core Stripes dependencies (UIIN-278)

## [1.1.0](https://github.com/folio-org/ui-inventory/tree/v1.1.0) (2018-09-05)
[Full Changelog](https://github.com/folio-org/ui-inventory/compare/v1.0.0...v1.1.0)

* Add instance record metadata (created date and updated date) (UIIN-28)
* Remove creators field (UIIN-30)
* Add item details view, initial version (UIIN-31)
* Add item form, holdings form (UIIN-5, UIIN-20)
* Add list of holdings records and items under instance view (UIIN-15,16,29,31,33)
* Project renamed from ui-instances to ui-inventory. UIIN-17.
* Update Okapi dependencies, inventory: 5.0 6.0, instance-storage 4.2, item-storage: 5.0
* Add Okapi dependencies on reference tables
* Use PropTypes, not React.PropTypes. STRIPES-427.
* Validation. Fixes UIIN-19.
* Show Title, Contributors, Publishers on search results. Fixes UIIN-9.
* Filter search results by Resource Type, Language, Location. Fixes UIIN-32.
* Identifiers and Contributors are now included in the search query, though not yet tied in on the back end. Refs UIIN-3.
* Add ability to copy instances. Fixes UIIN-24.
* Pruning local locale-date-formatters. Refs STCOR-109.
* Search complex fields (contributors, identifiers). Refs UIIN-3.
* Detail view refinement. Refs UIIN-28.
* Refactor through `<SearchAndSort>`. Fixes UIIN-34, Refs FOLIO-942, FOLIO-940, UIIN-41.
* Adding `<Notes>`. Fixes UIIN-10.
* Adding search by Location. Refs UIIN-3.
* Sort lookup tables server side because it's the right thing to do.
* Pass escape sequences on to CQL. Fixes UIIN-55.
* Close "Add holdings" pane correctly. Fixes UIIN-54.
* Sort contributor-types correctly. Refs UIIN-32.
* Implement `<RepeatableField>` component on InstanceForm. Fixes UIIN-52.
* (Enable and validate item-record's status field. Fixes UIIN-61. Rolled back again. UIIN-83)
* Require holdings-record's location field. Fixes UIIN-60.
* Search by barcode. Fixes UIIN-59.
* Sort contributor-type lookup table by name. Fixes UIIN-63.
* Update stripes-connect, redux-form dependencies. Refs STRIPES-501.
* Use stripes-components' Row and Col so that react-flexbox-grid remains a transitive dependency. Refs STRIPES-490.
* Restore show-single-record. Refs UIIN-58, STSMACOM-52.
* Fix validation of item-record's Material Type, Permanent Loan Type fields. Refs UIIN-61.
* Apply eslint-config-stripes. Enforces react/no-unused-state, no-restricted-globals, prefer-promise-reject-errors,  no-console and others.
* Fix lint errors due to new lint rules. UIIN-85.
* Set width of title to 40% in instance list. UIIN-78.
* Re-restoring show-single-record that was inadvertently removed in d9e3b8d565. Re-fixes UIIN-58. Available from v1.0.1.
* Pruning cruft methods unnecessary after the SearchAndSort conversion. Refs UIIN-34.
* Implement icons for instance, holdings, and item records. UIIN-49,50,51.
* Add creator/updater usernames to meta-data section. UIIN-97.
* Pass packageInfo to SearchAndSort; it's simpler. Refs STSMACOM-64. Available after v1.0.2.
* Enable Settings section for ui-inventory. UIIN-86.
* Lint. Fixes UIIN-104.
* Clone an item record. Fixes UIIN-27.
* Clone a holding record. Fixes UIIN-26.
* Add Material Types to Settings section. UIIN-87.
* Add Loan Types to Settings section. UIIN-88.
* Add targeted search dropdown. UIIN-56.
* Deprecate `transitionToParams` in favor of `this.props.mutator.query.update`. Fixes UIIN-109.
* Record IDs: Relabel 'FOLIO ID' to 'Instance ID'. Display 'Item ID', 'Holdings ID'. UIIN-113, UIIN-114, UIIN-115.
* Fix Okapi permission names. UIIN-136.
* Add contributorTypeId and contributorTypeText to instance form. UIIN-92.
* Ignore yarn-error.log file. Refs STRIPES-517.
* Wait for reference tables to load before rendering. UIIN-140, UIIN-141.
* Add 'primary' selector to contributors in instance forms. UIIN-131
* Show availability on item details. Fixes UIIN-110.
* Set cloned item's status to Available. Fixes UIIN-142.
* Changes section titles in Instance form. UIIN-72
* Migrate to hierarchical location end-point. Fixes UIIN-127.
* Handle "metaData" field case insensitively for compatibility. Fixes UIIN-159.
* Only show item-availability for open loans. Refs UIIN-110.
* Add location-units and locations to Okapi interfaces. Fixes UIIN-171.
* Correct use of i18n in validation function and props. Fixes UIIN-172.
* Confirmation when assigning inactive location. Fixes UIIN-121.
* Bah; metadata. One case to rule them all. Refs UIIN-159, CIRCSTORE-43.
* Fix holding and item forms. Fixes UIIN-174.
* Try harder to derive an item's status-date. Refs UIIN-110.
* Enable opening item view and holdings view in new tab. UIIN-147, UIIN-148.
* Use a single handler for managing row-level links in MCL. Refs UIIN-122.
* Replace shelf location references with locations. Fixes UIIN-182.
* Added `code` and `source` fields to several settings pages. Fixes UIIN-149, UIIN-150, UIIN-151, UIIN-152,
* Use exact match (double equal sign) for ID queries. UIIN-188.
* Fix uniqueness validation of Item bar-code. UIIN-189.
* Update to current users interface. Refs UIU-495.
* Update import paths for some stripes-components. Refs STCOM-277.
* Refactor to avoid deprecated React lifecycle methods.
* Add temporary location to HoldingsRecord form and details view. UIIN-194.
* Add item's permanent location to Item form and details view. UIIN-195.
* Display effective location on Item details view. UIIN-196.
* Enable un-setting a location. Fixes UIIN-198.
* Require inventory 5.3, item-storage 5.3, holdings-storage 1.3. UIIN-194,-195,-196
* Show metadata on holdings-edit and item-edit pages. Refs UIIN-191.
* Add initial MARC source view. UIIN-93
* Retrieve up to 40 loan-types for editing dropdown, and sort them by name. Fixes UIIN-213.
* Increase the contributor-type limit from 100 to 400. Fixes UIIN-215.
* Provide defaults for props used by plugin-find-instance. Refs UIIN-217.
* Bug fixes with no separate change log entry:
    UIIN-53, UIIN-64, UIIN-67, UIIN-68, UIIN-76, UIIN-77, UIIN-102, UIIN-175,
    UIIN-187, UIIN-190, UIIN-197, UIIN-205, UIIN-207, UIIN-214, UIIN-221,
* Basic tests for ui-instances. UIIN-7
* Edit Holding Associated with Instance v1. UIIN-39
* Regression test for holdings - add/edit. UIIN-43
* Regression test for items - add/edit. UIIN-44
* When listing contributor names, separate with ";". UIIN-65
* Limit sorting to single-column (at a time). UIIN-66
* Design graphQL schema and resolvers for inventory. UIIN-75
* Generate CQL query and pass it to graphQL. UIIN-94
* View Holdings record. Implement metadata component. UIIN-98
* View Items record. Implement the metadata component. UIIN-99
* Permission Set for Contributor Type CRUD. UIIN-156
* Permission Set for Resource Types CRUD. UIIN-157
* Permission Set for Formats CRUD. UIIN-158
* Change labels in Instance form. UIIN-164
* Add accordions to detailed view of the Instance Record. UIIN-166
* Set up testing for ui-inventory. UIIN-184
* Relocate language files. UIIN-186
* Replace location value "inherit from holding" with "-" in Item Record. UIIN-218
* Add "Select location" to Temporary Location Menu in Holding Record. UIIN-219
* Request count for an item should only include open requests. UIIN-241
* Apply expand/collapse all accordions toggle to the Instance detail. UIIN-244
* Aplly expand/collapse all accordions toggle to Holdings detail. UIIN-245
* apply expand/collapse all accordions toggle to Item detail. UIIN-246
* Use /inventory/instance endpoint, rather than storage, for instances. UIIN-263


## [1.0.0](https://github.com/folio-org/ui-instances/tree/v1.0.0) (2017-09-08)
[Full Changelog](https://github.com/folio-org/ui-items/compare/v0.0.1...v1.0.0)

* First version with basic instances list functionality. UIIN-1.

## [0.0.1](https://github.com/folio-org/ui-instances/tree/v0.0.1) (2017-09-07)

* Set up initial project for ui-instances. UIIN-6.
