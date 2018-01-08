# Change history for ui-inventory

## [1.1.0](IN PROGRESS)

* Add instance record metadata (created date and updated date) (UIIN-28)
* Remove creators field (UIIN-30)
* Add item details view, initial version (UIIN-31)
* Add item form, holdings form (UIIN-5, UIIN-20)
* Add list of holdings records and items under instance view (UIIN-15,16,29,31,33)
* Project renamed from ui-instances to ui-inventory. UIIN-17.
* Update Okapi dependencies, inventory: 5.0, instance-storage 4.0, item-storage: 5.0
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

## [1.0.0](https://github.com/folio-org/ui-instances/tree/v1.0.0) (2017-09-08)
[Full Changelog](https://github.com/folio-org/ui-items/compare/v0.0.1...v1.0.0)

* First version with basic instances list functionality. UIIN-1.

## [0.0.1](https://github.com/folio-org/ui-instances/tree/v0.0.1) (2017-09-07)

* Set up initial project for ui-instances. UIIN-6.
