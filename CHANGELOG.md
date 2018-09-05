# Change history for ui-inventory

## [1.2.0]IN PROGRESS

## [1.1.0](https://github.com/folio-org/ui-inventory/tree/v1.1.0) (2018-09-05)
[Full Changelog](https://github.com/folio-org/ui-items/compare/v1.0.0...v1.1.0)

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
