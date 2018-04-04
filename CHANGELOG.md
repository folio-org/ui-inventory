# Change history for ui-inventory

## [1.1.0](IN PROGRESS)

* Add instance record metadata (created date and updated date) (UIIN-28)
* Remove creators field (UIIN-30)
* Add item details view, initial version (UIIN-31)
* Add item form, holdings form (UIIN-5, UIIN-20)
* Add list of holdings records and items under instance view (UIIN-15,16,29,31,33)
* Project renamed from ui-instances to ui-inventory. UIIN-17.
* Update Okapi dependencies, inventory: 5.0, instance-storage 4.2, item-storage: 5.0
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
* Show availability on item details. Fixes UIIN-110.

## [1.0.0](https://github.com/folio-org/ui-instances/tree/v1.0.0) (2017-09-08)
[Full Changelog](https://github.com/folio-org/ui-items/compare/v0.0.1...v1.0.0)

* First version with basic instances list functionality. UIIN-1.

## [0.0.1](https://github.com/folio-org/ui-instances/tree/v0.0.1) (2017-09-07)

* Set up initial project for ui-instances. UIIN-6.
