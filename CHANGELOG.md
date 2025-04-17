# Change history for ui-inventory

## [14.0.0] (IN PROGRESS)

* Move focus on the Instance detail view pane when record is opened. Refs UIIN-3122.

## [13.0.3](https://github.com/folio-org/ui-inventory/tree/v13.0.3) (2025-04-14)
[Full Changelog](https://github.com/folio-org/ui-inventory/compare/v13.0.1...v13.0.3)

* Add `useSharedInstancesQuery` hook to determine if an instance is shared from a local one to display "Shared" in the version history original card. Fixes UIIN-3279.
* Call number browse | Remove held by facet for ECS. Refs UIIN-3301.
* Display "Shared" label for promoted to be shared FOLIO records. Fixes UIIN-3300.
* Remove default Staff suppress facet settings. Refs UIIN-3302.
* Use central tenant id in useUsersBatch to retrieve all users. Fixes UIIN-3321.
* Hide `Set for deletion` action when `Set for deletion` field value is true. Refs UIIN-3317.

## [13.0.1](https://github.com/folio-org/ui-inventory/tree/v13.0.1) (2025-04-04)
[Full Changelog](https://github.com/folio-org/ui-inventory/compare/v13.0.0...v13.0.1)

* Update instance header after overlaying source bibliographic record process. Fixes UIIN-3282.
* Missing values in the version history modal for Suppressed from discovery and Staff suppressed fields. Fixed UIIN-3277.
* Enable MARC-related options for shared MARC instance on member tenant. Fixes UIIN-3292.
* ECS FOLIO instances: Inventory version history feature toggle/icon. Refs UIIN-3284.
* Refactor `useAuditDataQuery` hooks to use `useInfiniteQuery` to implement loading indicator to version history panes. Refs UIIN-3286.
* ECS | "Version history" pane is empty for Shared FOLIO Instance when opened from Member tenant. Fixes UIIN-3280.

## [13.0.0](https://github.com/folio-org/ui-inventory/tree/v13.0.0) (2025-03-14)
[Full Changelog](https://github.com/folio-org/ui-inventory/compare/v12.0.12...v13.0.0)

* ECS | Instance details pane does not contain all tenants when user does not have affiliations / permissions in all tenants. Fixes UIIN-3113.
* *BREAKING* Rename quick-marc routes from `bib` to `bibliographic` and `duplicate` to `derive`. Refs UIIN-3120.
* *BREAKING* Provide necessary props for browse lookup facets. Remove the facets state reset functionality. Refs UIIN-3099.
* React v19: refactor away from default props for functional components. Refs UIIN-2890.
* User can edit Source consortium "Holdings sources" in member tenant but not in Consortia manager. Refs UIIN-3147.
* React 19: refactor away from react-dom/test-utils. Refs UIIN-2888.
* Add call number browse settings. Refs UIIN-3116.
* Add "linked-data 1.0" interface to "optionalOkapiInterfaces". Refs UIIN-3166.
* Remove hover-over text next to "Effective call number" on the Item record detail view. Refs UIIN-3131.
* Change import of `exportToCsv` from `stripes-util` to `stripes-components`. Refs UIIN-3025.
* ECS: Disable opening item details if a user is not affiliated with item's member tenant. Fixes UIIN-3187.
* Correctly depend on `inflected`. Refs UIIN-3203.
* Decrease the amount of rerenders in `ConsortialHoldings` component. Fixes UIIN-3196.
* Sort holdings by location name and call number. Refs UIIN-3207.
* Remove hover-over text next to "Shelving order" on the Item record detail view. Refs UIIN-3210.
* CI: Switch to centralized/shared workflow from https://github.com/folio-org/.github. Fixes UIIN-3218.
* Set correct widths for Call number browse results columns. Fixes UIIN-3229.
* Display actual instance state (shared or local) when user is using "Drag and drop" to move inventory records. Fixes UIIN-3185.
* Add Version history button and Version history pane to details view of Item. Refs UIIN-3172.
* Add Version history button and Version history pane to details view of Holdings. Refs UIIN-3171.
* Add Version history button and Version history pane to details view of Instance. Refs UIIN-3170.
* Add new ‘Set for deletion’ flag to display on 3rd pane Instance view. Refs UIIN-3191.
* Add settings options for using number gernerator for item barcode, accession number and call number. Refs UIIN-2557.
* Change itemNormalizedCallNumbers to itemFullCallNumbers in getCallNumberQuery. Refs UIIN-3234.
* *BREAKING* Create Inventory settings to configure number of cards in version history. Refs UIIN-3213.
* Add ‘Set for deletion’ checkbox field to Instance Edit view. Refs UIIN-3190.
* MARC Bib > View Source > Display Version History pane with an empty Version History component. Refs UIIN-3235.
* MARC Bib - Hide version history icon and settings if audit log feature is disabled. Refs UIIN-3237.
* Instance: Suppress action menu and disable buttons when click Change log icon. Refs UIIN-3176.
* Holdings: Suppress action menu and disable buttons when click Change log icon. Refs UIIN-3177.
* Item: Suppress action menu and disable buttons when click Change log icon. Refs UIIN-3178.
* Use the name CALL_NUMBERS_SHARED for the Shared facet instead of SHARED. Fixes UIIN-3254.
* Adapt settings options for using number gernerator. Refs UIIN-2556.
* Hide version history icon and settings if audit log feature is disabled. Refs UIIN-3231.
* Provide ids _and `length` param_ when retrieving job profiles. Refs UIIN-3257.
* Move ‘Set for deletion’ checkbox field to 4th space in top row of Instance Edit view. Refs UIIN-3259.
* Update Inventory: Set records for deletion permission's effect on ‘Set for deletion’ checkbox in Instance Edit view. Refs UIIN-3260.
* *BREAKING* Migrate stripes dependencies to their Sunflower versions. Refs UIIN-3223.
* *BREAKING* Migrate `react-intl` to v7. Refs UIIN-3224.
* Upgrade `browse` to `2.0`. Refs UIIN-3262.
* *BREAKING* Use "number generator" for barcode, accession number and call number. Refs UIIN-2546.
* *BREAKING* Instance: Display all versions in View history fourth pane. Refs UIIN-3173.
* *BREAKING* MARC bib > View Source > Display Version History. Refs UIIN-3261.
* "Copy barcode" icon is displayed next to item with no barcode. Fixes UIIN-3141.
* *BREAKING* Holdings: Display all versions in View history second pane. Refs UIIN-3174.
* *BREAKING* Item: Display all versions in View history second pane. Refs UIIN-3175.
* Replace annotations for compatibility with esbuild-loader. Refs UIIN-3271.
* Make user name hyperlink in version history inactive if user does not have permissions. Refs UIIN-3269.
* Display Original version card of the audit log with no field changes. Refs UIIN-3270.
* Change heading of modal generate accession and call number. Refs UIIN-3274.
* ViewSource - add tenantId to useAuditSettings. Refs UIIN-3266.
* Enhancement help text on Settings > Inventory > Number generator options. Refs UIIN-3217.
* Add default value for number of versions counter on "Version history" pane. Fixes UIIN-3283.

## [12.0.15](https://github.com/folio-org/ui-inventory/tree/v12.0.15) (2025-04-02)
[Full Changelog](https://github.com/folio-org/ui-inventory/compare/v12.0.14...v12.0.15)

* Ramsons CSP - Call number browse | Remove held by facet for ECS. Refs UIIN-3299.

## [12.0.14](https://github.com/folio-org/ui-inventory/tree/v12.0.14) (2025-03-26)
[Full Changelog](https://github.com/folio-org/ui-inventory/compare/v12.0.13...v12.0.14)

* Use `stripes.okapi.tenant` in order to get persistent id between pages. Fixes UIIN-3251.

## [12.0.13](https://github.com/folio-org/ui-inventory/tree/v12.0.13) (2025-03-04)
[Full Changelog](https://github.com/folio-org/ui-inventory/compare/v12.0.12...v12.0.13)

* Call Number Browse refactor - backport to Ramsons. Refs UIIN-3228.

## [12.0.12](https://github.com/folio-org/ui-inventory/tree/v12.0.12) (2025-01-27)
[Full Changelog](https://github.com/folio-org/ui-inventory/compare/v12.0.11...v12.0.12)

* Detail view of created Instance record is not loaded after saving. Fixes UIIN-3194.

## [12.0.11](https://github.com/folio-org/ui-inventory/tree/v12.0.11) (2025-01-24)
[Full Changelog](https://github.com/folio-org/ui-inventory/compare/v12.0.10...v12.0.11)

* Display failure message during `Update Ownership` action when Item contains Local reference data. Fixes UIIN-3195.

## [12.0.10](https://github.com/folio-org/ui-inventory/tree/v12.0.10) (2025-01-20)
[Full Changelog](https://github.com/folio-org/ui-inventory/compare/v12.0.9...v12.0.10)

* Fix '"location name" is undefined' error when trying to open instance details on ECS. Fixes UIIN-3196.
* Display `Shared` facet when user opens "Move holdings/items to another instance" modal. Refs UIIN-3198.
* ECS - Allow 'Move holdings/items to another instance' if instance is shared. Refs UIIN-3188.

## [12.0.9](https://github.com/folio-org/ui-inventory/tree/v12.0.9) (2025-01-13)
[Full Changelog](https://github.com/folio-org/ui-inventory/compare/v12.0.8...v12.0.9)

* Fix infinite loading animation after cancel edit/duplicate or 'Save & Close' consortial holdings/items. Fixes UIIN-3167.

## [12.0.8](https://github.com/folio-org/ui-inventory/tree/v12.0.8) (2024-12-24)
[Full Changelog](https://github.com/folio-org/ui-inventory/compare/v12.0.7...v12.0.8)

* Display holdings names in `Consortial holdings` accordion for user without inventory permissions in member tenants. Fixes UIIN-3159.
* Remove the ability to share local instance when `Inventory: View, create instances` permission is assigned. Fixes UIIN-3166.
* *BREAKING* Use `browse` `1.5` interface that provides new Call Number Browse endpoints. Refs UIIN-3162.
* Add `getCallNumberQuery` function to build a query string based on the call number and its type. Refs UIIN-3205.

## [12.0.7](https://github.com/folio-org/ui-inventory/tree/v12.0.7) (2024-12-17)
[Full Changelog](https://github.com/folio-org/ui-inventory/compare/v12.0.6...v12.0.7)

* Handle `null` `typeIds` in `browse/config/instance-classification` response. Fixes UIIN-3161.
* Add `limit=1000` to `subject-sources` request to fetch more subject sources. Fixes UIIN-3163.

## [12.0.6](https://github.com/folio-org/ui-inventory/tree/v12.0.6) (2024-12-06)
[Full Changelog](https://github.com/folio-org/ui-inventory/compare/v12.0.5...v12.0.6)

* Display user's name instead of "Unknown user" in "Last updated" field in "Settings" for member tenant. Fixes UIIN-3144.
* Set default sorting to URL in componentDidMount and componentDidUpdate if it is missing. Fixes UIIN-3137.

## [12.0.5](https://github.com/folio-org/ui-inventory/tree/v12.0.5) (2024-12-04)
[Full Changelog](https://github.com/folio-org/ui-inventory/compare/v12.0.4...v12.0.5)

* Display informative error message when editing same instance, holdings, item in two tabs. Fixes UIIN-3127.
* User can edit Source consortium "Holdings sources" in member tenant but not in Consortia manager. Refs UIIN-3147.
* Set the previously used offset by executing `resultOffset.replace` when changing the segment. Fixes UIIN-3143.

## [12.0.4](https://github.com/folio-org/ui-inventory/tree/v12.0.4) (2024-12-03)
[Full Changelog](https://github.com/folio-org/ui-inventory/compare/v12.0.3...v12.0.4)

* Add permission for "Share local instance" option on Member tenants. Refs UIIN-3140.
* Update Linked data API URL to use the new API path. Fixes UIIN-3146.

## [12.0.3](https://github.com/folio-org/ui-inventory/tree/v12.0.3) (2024-11-27)
[Full Changelog](https://github.com/folio-org/ui-inventory/compare/v12.0.2...v12.0.3)

* Resolve issue with page refresh when moving a holding to an instance. Fixes UIIN-3046.

## [12.0.2](https://github.com/folio-org/ui-inventory/tree/v12.0.2) (2024-11-22)
[Full Changelog](https://github.com/folio-org/ui-inventory/compare/v12.0.1...v12.0.2)

* ECS | Instance details pane does not contain all tenants when user does not have affiliations / permissions in all tenants. Fixes UIIN-3113.

## [12.0.1](https://github.com/folio-org/ui-inventory/tree/v12.0.1) (2024-11-15)
[Full Changelog](https://github.com/folio-org/ui-inventory/compare/v12.0.0...v12.0.1)

* Run `history.replace` once during component mount and update to avoid URL rewriting. Refs UIIN-3099.
* ECS | "FOLIO/MARC-shared" source is displayed in manually shared instance record. Fixes UIIN-3115.
* Allow user to move item to another holdings associated with another instance. Fixes UIIN-3102.
* Cautiously evaluate tenant permissions to avoid NPEs. Refs UIIN-3124.

## [12.0.0](https://github.com/folio-org/ui-inventory/tree/v12.0.0) (2024-10-31)
[Full Changelog](https://github.com/folio-org/ui-inventory/compare/v11.0.5...v12.0.0)

* Remove unused code related to auto-open record detail view. Refs UIIN-2819.
* Keyboard shortcuts modal: Add quickMARC shortcuts to modal. Refs UIIN-2795.
* Create new settings for classification type sorting. Refs UIIN-2775.
* Add "Display to public" column to receiving history on Holdings. Refs UIIN-2826.
* Add new browse options for Instance classification numbers. Refs UIIN-2624.
* Add new Instance search option `Classification, normalized` for the `Instance` toggle and advanced search modal. Refs UIIN-2801.
* Import `useUserTenantPermissions`, `getUserTenantsPermissions` from `@folio/stripes/core`. Refs UIIN-2837.
* ECS Member tenant - add `Shared` and `Held by` facets for the `Classification` browse. Refs UIIN-2813.
* Jest/RTL: Cover CalloutRenderer component with unit tests. Refs UIIN-2665.
* Jest/RTL: Cover ConnectedTitle component with unit tests. Refs UIIN-2666.
* Jest/RTL: Cover InstancePlugin component with unit tests. Refs UIIN-2668.
* Jest/RTL: Cover ImportRecord component with unit test. Refs UIIN-2667.
* Jest/RTL: Cover MoveHoldingContext component with unit tests. Refs UIIN-2664.
* Use consolidated locations endpoint to fetch all locations when in central tenant context. Refs UIIN-2811.
* Change label of eye-readable call number search option in holdings/items. Refs UIIN-2797.
* Jest/RTL: Cover ModalContent components with unit tests. Refs UIIN-2669.
* Add callout noting user's active affiliation when it changes after selecting holding or item. Refs UIIN-2831, UIIN-2872.
* Jest/RTL: Cover LocationSelectionWithCheck components with unit tests. Refs UIIN-2670.
* Populate Acquisitions accordion on instance when central ordering is active. Refs UIIN-2793.
* Inventory app: Define and implement shortcut key for editing a quickMARC bib record. Refs UIIN-2896.
* *BREAKING* Added a new `stripes-inventory-components` dependency. Move some utils to that module. Refs UIIN-2910.
* Jest/RTL: Cover HRIDHandlingSettings components with unit tests. Refs UIIN-2671.
* Add classification browse types to facets requests when performing Browse. Fixes UIIN-2897.
* Import `CheckboxFacet`, `CheckboxFacetList`, `HeldByFacet`, `withFacets`, facets constants, `fieldSearchConfigurations` constant, `queryIndexes` constants, `facetsStore`, and some of the utils from `stripes-inventory-components`. Refs UIIN-2781.
* Import the new `useFacets` functionality from `stripes-inventory-components`. Refs UIIN-2910.
* Edit Inventory Instances: Display a Save & keep editing button. Refs UIIN-2457.
* Edit Inventory Holdings: Display a Save & keep editing button. Refs UIIN-2404.
* "holdings-storage" API version upgrade. Refs UIIN-2926.
* Edit Inventory Items: Display a Save & keep editing button. Refs UIIN-2456.
* Prevent users from editing tags when Instance/Holdings/Item is updated. Fixes UIIN-2941.
* Instance record > Classification accordion > Display a clipboard icon next to classification number. Refs UIIN-2580.
* Populate Acquisitions accordion on item when central ordering is active. Refs UIIN-2818.
* Import facets and the function for building a search query from `stripes-inventory-components`.
* Add Bound items accordion in item record. Refs UIIN-2760.
* Edit Inventory Instances: Optimistic locking error displays in pop-up modal instead of banner in the header. Fixes UIIN-2940.
* Make item barcode column narrower. Fixes UIIN-2925.
* i18n item status in item edit view. Refs UIIN-2766.
* Enable "+ New" and "Edit" buttons when user has "Settings (Inventory): Configure single-record import" permission. Refs UIIN-2771.
* Allow user to view `HRID handling` section when "Settings (Inventory): View list of settings pages" permission is assigned
and disable fields when "Settings (Inventory): Create, edit and delete HRID handling" permission is not assigned. Refs UIIN-2773.
* Update "Settings (Inventory): Create, edit, delete statistical codes" permission. Refs UIIN-2772.
* Focus on record title after closing record details view, on search field after canceling record creation, on close record details view icon after closing quick-marc. Refs UIIN-2962.
* Include `stripes-inventory-components` and `stripes-marc-components` in `stripesDeps` to include their translations. Refs UIIN-2968.
* Trigger search from icon in related titles on Instance detail view. Refs UIIN-2943.
* Enable "View source" option for "LINKED_DATA" source type in "Actions" dropdown. Refs in UIIN-2966.
* Create a text link for classification numbers based on classification types. Refs UIIN-2907.
* Add "Edit in Linked Data editor" action for resources with source "LINKED_DATA". Refs UIIN-2963.
* Clicking on item in Inventory no longer opens the item record in a new tab. Fixes UIIN-2924.
* Add `skipTrimOnChange` option to `useLocationFilters` hook to prevent unnecessary trims on change. Refs UIIN-2976.
* Enable 'Edit in Linked Data Editor' option to Action dropdown. Refs UIIN-2965.
* Wrong statistical code column heading is displayed in instances, holdings, and items. Fixes UIIN-2922.
* Update "Edit Instance" workform for resources with source "LINKED_DATA". Refs UIIN-2967.
* Inventory App: Consume {{FormattedTime}} via stripes-component. Refs UIIN-1273.
* Update request to go to inventory API when Holdings is updated. Refs UIIN-2779.
* Add barcode values for "Bound pieces data" and update `useBoundPieces` hook query with `bindItemId` to fetch bound pieces correctly. Refs UIIN-2984.
* Display "New order" action in instance action menu when active affiliation set to central tenant. Refs UIIN-2955.
* Save Instances UUIDs - When request URI exceeds character limit split request. Refs UIIN-2977.
* Use `withSearchErrors` HOC and `buildRecordsManifest` to display an error when the request URL is exceeded. Refs UIIN-2970.
* Edit in Linked Data Editor when source=MARC. Refs UIIN-2978.
* Display shared instance immediately after the instance was shared. Refs UIIN-2969.
* Disable Move to button if no items selected or no more holdings exists within an instance. Refs UIIN-2995.
* Prevent callbacks from being triggered when clicking on the current tab, whether it's lookup mode or a segment. Fixes UIIN-2949.
* Hide call number type options for Local, Other scheme, and SuDoc for perf environment. Refs UIIN-2923.
* Edit Inventory Instances: "Save & close" and "Save and keep editing" buttons could be clicked 2 times in a row. Fixes UIIN-2939.
* Create a new ‘Inventory: Update ownership’ permission to control display of Update ownership action. Refs UIIN-2981.
* Add inventory permission: Settings (Inventory): Create, edit, delete subject sources. Refs UIIN-3010.
* Add inventory permission: Settings (Inventory): Create, edit, delete subject types. Refs UIIN-3009.
* Update required permissions for quick export of instances. Refs UIIN-3003.
* Add `showSortIndicator` prop to `SearchAndSort` to display sort indicator next to the column names, and add correct `nonInteractiveHeaders`. Refs UIIN-2986.
* Change casing of `Linked data editor` label. Refs UIIN-3007.
* MARC bib/holdings | View Source: Add Edit and Export actions. Refs UIIN-3012.
* Trim call numbers when Creating/Editing/Deriving Holdings/Items. Fixes UIIN-2889.
* New Inventory Settings: Subject types and Subject sources. Refs UIIN-2822.
* Disable `Save and keep editing` and `Save & close` buttons when submit the instance form. Fixes UIIN-2939.
* Remove call number type options for Local, Other scheme, and SuDoc. Refs UIIN-3014.
* Use the sort option from the new `DisplaySettings` until the user changes it in any available way. Refs UIIN-2722.
* Rename `Classification` and `Call numbers` sections in browse options. Refs UIIN-2982.
* Edit/Create -- Subject accordion instance UI changes. Refs UIIN-2944.
* Add the Date column to the results list. Refs UIIN-1876.
* Instance Detail/Edit/New: Add new section for Date type, Date 1, & Date 2. Refs UIIN-2849.
* Add the ability to update ownership of holdings. Refs UIIN-2753.
* Add the ability to update ownership of items. Refs UIIN-2754.
* Update user when switching affiliation. Fixes UIIN-2932.
* Add ability to sort Search results by Date. Refs UIIN-2850.
* Implement default Date type when not present - No attempt to code. Refs UIIN-3034.
* Remove 'Overlay' and 'Set for deletion' functions for LINKED_DATA source type. Refs UIIN-3011.
* Store item IDs in local storage in order to make it visited. Fixes UIIN-2994.
* View -- Subject accordion instance UI changes. Refs UIIN-2823.
* Mock `Modal` from `stripes-components`; fix tests. Refs UIIN-3045.
* Extend permissions for creating, editing and deleting reference data. Fixes UIIN-2586.
* Update "Barcode" column link in "Bound pieces data" accordion. Refs UIIN-3041.
* ECS - check for central tenant permissions in Settings > Classification Browse. Fixes UIIN-3038.
* Display action menu when user has only permission to move holdings/items. Fixes UIIN-3040.
* Make "Barcode" field wrapping to next row when there are many characters in the value. Fixes UIIN-2958.
* Fixed "Settings" > "Inventory" page does not load. Fixes UIIN-3053.
* Display an item that has an open loan whose patron record has been removed. Fixes UIIN-3044.
* Display "Classification browse" settings for non-consortia. Fixes UIIN-3057.
* Fix eslint warnings. Refs UIIN-3064.
* Disable link to POL when it leads to another tenant (instance, holding and item). Refs UIIN-3024.
* Add code to subject source settings. Refs UIIN-3056.
* Alter rules for display of 'Edit in Linked data editor' option in Inventory Action drop down. Refs UIIN-3051.
* Upgrade `inventory` to `14.0` and `instance-storage` to `11.0`. Refs UIIN-3065.
* Add subject source and subject type to Inventory subject browse results. Refs UIIN-2960.
* Add filters for subject source and type to Inventory subject browse. Refs UIIN-2961.
* Update 'Instance relationship' accordion name - VIEW/EDIT/CREATE Instance. Refs UIIN-3081.
* Create alert to prevent moving holding to another instance if Po Line has multiple holdings. Refs UIIN-3046.
* Update sub permissions in the `package.json` and upgrade `holdings-storage` to `8.0`. Refs UIIN-3061.
* ECS - Disallow 'Move items within an instance' and 'Move holdings/items to another instance' if no LOCAL Items/Holdings exist. Refs UIIN-3073.
* *BREAKING* Update sub permissions in the `package.json` and upgrade `source-storage-records` to `3.3` and `data-import-converter-storage` to `1.5`. Refs UIIN-3086.
* *BREAKING* Bump `stripes` to `v9.2.0` for Ramsons release. Refs UIIN-2961.
* Include current location into redirects to Linked data editor. Refs UIIN-3092.
* Use `ResetProvider` to subscribe and publish the reset event and unsubscribe from it after a segment switch. Refs UIIN-3093.
* Rename inventory.consortia permissions. Refs UIIN-3076.
* Disallow displaying shared instances when find instance modal is open. Refs UIIN-3072.
* ECS: Item affiliation cannot be changed when it is attached to a local order. Refs UIIN-3063.
* Refactor ui-inventory permissions. Refs UIIN-3087.
* Disallow displaying shared instances when find instance modal is open. Refs UIIN-3072.
* Update permission name after Review and cleanup Module Descriptor for ui-requests. Refs UIIN-3058.
* Browse | Number of titles in Subject browse results does not match the number of instances returned in search. Fixes UIIN-3101.
* Adjust the URI of a redirect to Linked data editor. Fixes UIIN-3107.
* Rename "mod-settings.global.*" permissions. Refs UIIN-3109.
* Suppress edit and delete actions of subject types and sources for `consortium` source. Refs UIIN-3112.
* Add 'replaces' array to refactored ui permissions. Refs UIIN-3110.
* Update quick-marc permission name. Refs UIIN-3111.
* ECS: Prevent Item affiliation ownership change if it is attached to a local PO line. Refs UIIN-3105.
* Add missing BE permission`source-storage.records.matching.collection.post`. Fixes UIIN-3086.
* Display correctly `Mark as ...` action items in Item action menu. Fixes UIIN-3114.

## [11.0.5](https://github.com/folio-org/ui-inventory/tree/v11.0.5) (2024-08-29)
[Full Changelog](https://github.com/folio-org/ui-inventory/compare/v11.0.4...v11.0.5)

* Remove call number type options for Local, Other scheme, and SuDoc. Refs UIIN-3014.

## [11.0.4](https://github.com/folio-org/ui-inventory/tree/v11.0.4) (2024-04-30)
[Full Changelog](https://github.com/folio-org/ui-inventory/compare/v11.0.3...v11.0.4)

* Replace `all` with the `=` operator to get correct results when using the `All` search option. Refs UIIN-2816.

## [11.0.3](https://github.com/folio-org/ui-inventory/tree/v11.0.3) (2024-04-26)
[Full Changelog](https://github.com/folio-org/ui-inventory/compare/v11.0.2...v11.0.3)

* Fetch facets with the same query as `Contributor` records when the search is done by selecting browse result. Refs UIIN-2859.
* Change the `Effective location` call numbers facet query to not see locations assigned to items with an empty `Effective call number` field. Refs UIIN-2871.
* Do not remove field from the form when its value is an empty string. Fixes UIIN-2787.
* Update Permission name for Inventory: Set records for deletion and staff suppress. Refs UIIN-2855.

## [11.0.2](https://github.com/folio-org/ui-inventory/tree/v11.0.2) (2024-04-19)
[Full Changelog](https://github.com/folio-org/ui-inventory/compare/v11.0.1...v11.0.2)

* ECS: Shared instance cannot be edited from member tenant, even with permissions in both Central and member tenants. Fixes UIIN-2845.
* Restricted status displays as Order Closed. Fixes UIIN-2821.
* Add a new "Inventory: Create and download In transit items report" permission. Fixes UIIN-2776.
* Include mod-search permissions to "Inventory: Module is enabled" UI permission. Refs UIIN-2860.

## [11.0.1](https://github.com/folio-org/ui-inventory/tree/v11.0.1) (2024-04-11)
[Full Changelog](https://github.com/folio-org/ui-inventory/compare/v11.0.0...v11.0.1)

* Keep query and results list when switching Browse options. Refs UIIN-2802.
* Set central tenant id in the request when Member tenant deletes a shared record. Fixes UIIN-2784.
* Apply staff suppress filter for first search in Holdings/Items. Fixes UIIN-2814.
* Pass tenantId when open holding details during moving holdings/items. Fixes UIIN-2815.
* ECS - Member consortial accordion is not displaying when a user has affiliations but does not have permission to view holdings. Fixes UIIN-2843.

## [11.0.0](https://github.com/folio-org/ui-inventory/tree/v11.0.0) (2024-03-21)
[Full Changelog](https://github.com/folio-org/ui-inventory/compare/v10.0.11...v11.0.0)

* *BREAKING* Replace imports from quick-marc with stripes-marc-components. Refs UIIN-2636.
* Make Inventory search and browse query boxes expandable. Refs UIIN-2493.
* Added support for `containsAny` match option in Advanced search. Refs UIIN-2486.
* Inventory search/browse: Do not retain checkbox selections when toggling search segment. Refs UIIN-2477.
* Show Instance record after creating with Fast add option. Refs UIIN-2497.
* Search box/Browse box- Reset all should shift focus back to search box. Refs UIIN-2514.
* Updated translations for adding new Instance records. Refs UIIN-2630.
* Ignored hot key command on edit fields. Refs UIIN-2604.
* Don't render Fast Add record modal in a `<Paneset>` to re-calculate other `<Pane>`'s widths after closing. Fixes UIIN-2690.
* "Saving instance failed" modal does not show error message. Fixes UIIN-2686.
* Browse Lists | Focus updates. Fixes UIIN-2267.
* Users with data export view only permission. Refs UIIN-2660.
* Always highlight the first list row after pagination is clicked. Refs UIIN-2708.
* The quantity of assigned tags to the instance is not displaying in the little tag icon after assigning. Fixes UIIN-2559.
* Reset search/browse query when user switches affiliation. Refs UIIN-2715.
* Moving items between holdings records doesn't update correctly in UI. Fixes UIIN-2692.
* Update permission for Staff suppressed facet. Refs UIIN-2705.
* Add permission for setting record for deletion. Refs UIIN-2593.
* Mock ResizeObserver to fix failed tests. Refs UIIN-2738.
* Fix "Edit in quickMARC" and "View source" options are disabled in the expanded dropdown on the holdings details view. Fixes UIIN-2735.
* Add Set record for deletion option in Actions menu with Confirmation modal. Refs UIIN-2594.
* Use `onSave` prop for quickMARC to handle saving records separately. Refs UIIN-2743.
* Set Inventory settings HTML page title this format - `<<App name>> settings - <<selected page name>> - FOLIO`. Refs UIIN-2713.
* Add "Display summary" field to item enumeration data accordion. Refs UIIN-2740.
* Display the 'Holdings detail' page after saving the holding changes. Fixes UIIN-2734.
* *BREAKING* Bump up okapi interfaces for `pieces` (3.0). Refs UIIN-2761.
* Action when Set record for deletion option is invoked. Refs UIIN-2595.
* Detail view not opened for non-local items when one shared record found using "Barcode" search on "Item" tab. Fixes UIIN-2698.
* Jest/RTL: Cover CreateHoldings component with unit tests. Refs UIIN-2663.
* Staff suppress facet - use `No` as default value. Hide the facet when users don't have permissions to use it. Refs UIIN-2596.
* Add a new search option for instances called `LCCN normalization`. Refs UIIN-2245.
* Add and adjust collapse/expand buttons for consortial instances. Refs UIIN-2711.
* Increase holdings limit to 5000. Fixes UIIN-2785.
* User with "Inventory: All permissions" permission only should not be seeing the "Staff suppress" facet. Fixes UIIN-2807.

## [10.0.14](https://github.com/folio-org/ui-inventory/tree/v10.0.14) (2024-04-25)
[Full Changelog](https://github.com/folio-org/ui-inventory/compare/v10.0.13...v10.0.14)

* Include mod-search permissions to "Inventory: Module is enabled" UI permission. Refs UIIN-2860.

## [10.0.13](https://github.com/folio-org/ui-inventory/tree/v10.0.13) (2024-04-18)
[Full Changelog](https://github.com/folio-org/ui-inventory/compare/v10.0.12...v10.0.13)

* ECS: Shared instance cannot be edited from member tenant, even with permissions in both Central and member tenants. Fixes UIIN-2832.

## [10.0.12](https://github.com/folio-org/ui-inventory/tree/v10.0.12) (2024-04-10)
[Full Changelog](https://github.com/folio-org/ui-inventory/compare/v10.0.11...v10.0.12)

* ECS - Member consortial accordion is not displaying when a user has affiliations but does not have permission to view holdings. Fixes UIIN-2780.

## [10.0.11](https://github.com/folio-org/ui-inventory/tree/v10.0.11) (2024-03-01)
[Full Changelog](https://github.com/folio-org/ui-inventory/compare/v10.0.10...v10.0.11)

* Display Holdings/Item Electronic Access URIs consistent with Instances. Fixes UIIN-2778.

## [10.0.10](https://github.com/folio-org/ui-inventory/tree/v10.0.10) (2024-01-17)
[Full Changelog](https://github.com/folio-org/ui-inventory/compare/v10.0.9...v10.0.10)

* ECS: id of member tenant is undefined when rendering consortial holdings. Fixes UIIN-2724.

## [10.0.9](https://github.com/folio-org/ui-inventory/tree/v10.0.9) (2023-12-29)
[Full Changelog](https://github.com/folio-org/ui-inventory/compare/v10.0.8...v10.0.9)

* ECS: Effective location facet is not showing other member tenants. Fixes UIIN-2728.

## [10.0.8](https://github.com/folio-org/ui-inventory/tree/v10.0.8) (2023-12-06)
[Full Changelog](https://github.com/folio-org/ui-inventory/compare/v10.0.7...v10.0.8)

* Correctly display location data for holdings and items when tenant is changed. Fixes UIIN-2697.
* Disable the "Share" button after clicking it once on "Are you sure you want to share this instance?" modal window. Refs UIIN-2704.
* Users with data export view only permission. Refs UIIN-2660.
* Refactor CSS away from `color()` function. Refs  UIIN-2716.

## [10.0.7](https://github.com/folio-org/ui-inventory/tree/v10.0.7) (2023-12-06)
[Full Changelog](https://github.com/folio-org/ui-inventory/compare/v10.0.6...v10.0.7)

* Make browse result items that are not anchors and have no records not clickable, and show 0 in number of titles. Fixes UIIN-2699.

## [10.0.6](https://github.com/folio-org/ui-inventory/tree/v10.0.6) (2023-11-24)
[Full Changelog](https://github.com/folio-org/ui-inventory/compare/v10.0.5...v10.0.6)

* "Something went wrong" error appears when user selects Shared Instance as "Child/Parent Instance" for Local Instance without permissions at Central tenant. Fixes UIIN-2695.
* Inactive Holdings/items on Central tenant when user have affiliation for separate Member with 0 permissions. Fixes UIIN-2689.

## [10.0.5](https://github.com/folio-org/ui-inventory/tree/v10.0.5) (2023-11-22)
[Full Changelog](https://github.com/folio-org/ui-inventory/compare/v10.0.4...v10.0.5)

* Don't include `sort` parameter in requests to facets. Fixes UIIN-2685.
* Inventory app > Search and Browse Results > Update HTML page title with search term entered. Refs UIIN-2581.

## [10.0.4](https://github.com/folio-org/ui-inventory/tree/v10.0.4) (2023-11-10)
[Full Changelog](https://github.com/folio-org/ui-inventory/compare/v10.0.3...v10.0.4)

* Fetch sharing of local instance status in the context of member tenant. Refs UIIN-2680.
* Handle errors when sharing local instances failed. Refs UIIN-2682.

## [10.0.3](https://github.com/folio-org/ui-inventory/tree/v10.0.3) (2023-11-08)
[Full Changelog](https://github.com/folio-org/ui-inventory/compare/v10.0.2...v10.0.3)

* ECS: Show info message when user in member tenant tries to view shared instance details without permission. Refs UIIN-2590.
* Show only local MARC Authorities when share local instance. Fixes UIIN-2647.
* Single instance export - MARC files sent to central tenant from member tenant. Fixes UIIN-2613.
* Fix misspelled Instance notes (all) advanced search query index. Fixes UIIN-2677.
* Switch from `=` to `==` operator when querying for `holdings-storage/holdings` by hrid. Fixes UIIN-2658.

## [10.0.2](https://github.com/folio-org/ui-inventory/tree/v10.0.2) (2023-11-07)
[Full Changelog](https://github.com/folio-org/ui-inventory/compare/v10.0.1...v10.0.2)

* Enable/disable consortial holdings/item actions based on User permissions. Refs UIIN-2452.
* Instance. Series heading has vanished in detailed view. Fixes UIIN-2601.
* Add immediate warning message when a local instance is shared. Refs UIIN-2617.
* Optimistic locking message not working for instances in non-consortial tenant. Fixes UIIN-2628.
* User receives an error when searching for an item in the Inventory app. Fixes UIIN-2634.
* Create new instance success toast no longer shows the instance HRID. Fixes UIIN-2635.

## [10.0.1](https://github.com/folio-org/ui-inventory/tree/v10.0.1) (2023-11-03)
[Full Changelog](https://github.com/folio-org/ui-inventory/compare/v10.0.0...v10.0.1)

* Instance 3rd pane: Adjust behavior when returning to instance from holdings/item full screen. Refs UIIN-2453.
* Consortial holdings accordion is not appearing after the sharing of Instance. Fixes UIIN-2629.
* Reset CheckboxFacet state.more when user resets search form and fewer facet options are loaded. Fixes UIIN-2531.
* Edit instance success toast no longer shows the instance HRID. Fixes UIIN-2588.
* Show facet options, if they exist, after clicking the +More button. Refs UIIN-2533.
* If Shared & Held by facets were selected in the Browse search, then retain them in the Search lookup after clicking the record. Refs UIIN-2608.
* Remove error message after switch from Instance Edit screen to another app. Fixes UIIN-2600.

## [10.0.0](https://github.com/folio-org/ui-inventory/tree/v10.0.0) (2023-10-13)
[Full Changelog](https://github.com/folio-org/ui-inventory/compare/v9.4.12...v10.0.0)

* Added a new option in the "Actions" dropdown within the Inventory app search page for "+New MARC Bib Record". Refs UIIN-2356.
* Change the url for the "New MARC Bib Record" page. Refs UIIN-2380.
* Avoid private paths in stripes-core imports. Refs UIIN-2367.
* Add bound-with parts to an Item.  Refs UIIN-1998.
* Fix for Note text box starts flickering/jumping in Instance/Holding/Items during resizing. Refs. UIIN-2387.
* Instance Create/Edit screens: Replace custom RepeatableField with component from stripes. Refs UIIN-2390.
* Instance Create/Edit screens: Repeatable field trashcan is not aligned with the data row. Fixes UIIN-2372.
* Holdings Create/Edit screens: Replace custom RepeatableField with component from stripes. Refs UIIN-2398.
* Holdings Create/Edit screens: Repeatable field trashcan is not aligned with the data row. Fixes UIIN-2373.
* Holdings view source: Print button not visible with "View MARC holdings record" permission. Refs UIIN-2405.
* The 'Missing' and 'Withdrawn' options in the actions menu are absent after clicking on the 'Actions' button for item status "In process". Fixes UIIN-2338.
* Item Create/Edit screens: Replace custom RepeatableField with component from stripes. Refs UIIN-2397.
* Item Create/Edit screens: Repeatable field trashcan is not aligned with the data row. Fixes UIIN-2374.
* Chronology not displayed in receiving history. Fixes UIIN-2411.
* Also support `circulation` `14.0`. Refs UIIN-2412.
* Instance/Holdings/Item notes, administrative notes character limit to 32K. Refs UIIN-2354.
* Import testing-library deps from `@folio/jest-config-stripes`. Refs UIIN-2427.
* Bump zustand to v4. Refs UIIN-2353.
* Fix the `records-editor/records` request by adding `_actionType`. Refs UIIN-2431.
* Navigating away and back to item-edit or holdings-edit screen throws NPE. Fixes UIIN-2112.
* ISRI: Adjust jobProfiles GET request to fetch profiles by ids. Refs UIIN-2428.
* Sorting of profiles is not executed in alphabetical order in the Z39.50 target profiles View. Fixes UIIN-2424.
* Added sort options in Actions for Instance/Holdings/Item. Refs UIIN-2357.
* Statistical code empty field error. Refs UIIN-2420.
* Hide the `Actions` button for the view page if there are no permissions. Refs UIIN-2360.
* When duplicating an item, the circulation history is duplicated when it should not be. Fixes UIIN-2419.
* Don't reset browse query when on Browse route and click Browse segment. Fixes UIIN-2434.
* Prevent double-escaping of query when Browsing. Fixes UIIN-2435.
* When adding items, cursor is in the barcode field as default. Refs UIIN-2205.
* Quick export from instance detail view. Refs UIIN-2430.
* Escape quotes to search for Subjects and Contributor. Refs UIIN-2445.
* Fix Search and Browse navigation and determining if the button is active. Refs UIIN-2444.
* Scrolling within Inventory facets. Refs UIIN-2377.
* When removing the dead icons in the Item record, then the displayed text looks inconsistent. Fixes UIIN-1392.
* Adjust the sentence case for some Inventory action options. Refs UIIN-2436.
* Adjust the Instance Edit screen header. Refs UIIN-2437.
* Inventory: Retain Search/Browse query/options/filter and facet selections UNLESS user resets/clear selections. Refs UIIN-2433.
* Statistical Code dropdown "contains" type ahead functionality needed (Instance/Holdings/Items). Refs UIIN-2466.
* Fix problem with a large number of items on a single holdings record. Refs UIIN-2478.
* Decrease rerenders for TargetProfileDetail component to avoid errors when view the target profile. Fixes UIIN-2467.
* leverage cookie-based authentication in all API requests. Refs UIIN-2282.
* Restrict modifying and deleting system call number types. Refs UIIN-2385.
* Prevent editing of shared settings from outside "Consortium manager". Refs UIIN-2482.
* Add new browse options to limit browse by call number type. Fixes UIIN-2467.
* Implement Advanced search modal. Refs UIIN-1920.
* Remove override CSS for TextLink. Refs UIIN-2365.
* Remove BigTest infrastructure including tests, deps, config. Refs UIIN-2317.
* Hide Inventory actions related to Local records in Central tenant. Refs UIIN-2491.
* Add Shared icon to inventory instance results. Refs UIIN-2491.
* User with limited permissions gets an error modal when navigating to the Inventory app. Fixes UIIN-2490.
* *BREAKING* Bump `react` to `v18`. Refs UIIN-2508.
* Add `Shared` facet to Instance/Holdings/Items search. Refs UIIN-2393.
* Add `Shared` search parameter when the user is redirected to the quick-marc page to identify shared record. Refs UIIN-2517.
* Instance Edit screen header: add shared/local indication. Refs UIIN-2438.
* i18n item status in item list. Refs UIIN-2473.
* Disable "Save & close" button by default in "Create new Item" window. Fixes UIIN-2492.
* Inventory 2nd pane Actions menu: Adjust New action. Refs UIIN-2439.
* Add "Local" or "Shared" to flag MARC bib records. Refs UIIN-2522.
* Edit MARC bib record on Shared Instance. Refs UIIN-2526.
* Allow for new source values for shadow Instances. Refs UIIN-2459.
* Update Node.js to v18 in GitHub Actions. Refs UIIN-2520.
* Fix issue with Relevance sort option. Refs UIIN-2474.
* Change tenant id to central when opening details of shadow instance. Refs UIIN-2529.
* "Something went wrong" screen appears when adding Item to Holdings. Fixes UIIN-2534.
* Sorting on the Instance's Holdings item table is not working. Fixes UIIN-2528.
* ECS: use mod-search to get tenantId for local/shared instance details. Refs UIIN-2538.
* Make the 'enabled' argument always boolean when calling useUserTenantPermissions. Refs UIIN-2540.
* Instance details are not shown on Inventory pane. Fixes UIIN-2541.
* Enclose the query in quotes to allow for parentheses. Fixes UIIN-2516.
* Make the isShared prop boolean to avoid crashes when calling methods from undefined. Fixes UIIN-2554.
* Add advanced search query for facets. Fixes UIIN-2536.
* Show Effective location facet for all Call Number browse sub-options. Fixes UIIN-2499.
* Enable pagination/item number information in the Instance's Holding Item list. Fixes UIIN-2530.
* Adjust behaviour of View source for shared instances. Refs UIIN-2449.
* Consortial Central Tenant: Handling of Instance Action Menu options. Refs UIIN-2498.
* ECS: display shadow instances as shared. Refs UIIN-2552.
* Display correct number of items in the Instance's Holding accordion. Fixes UIIN-2550.
* Don't reset filters after changing a search option. Fixes UIIN-2566.
* Fix issue with 'Up' caret on default sort Holdings/Items segments. Refs UIIN-2553.
* *BREAKING* bump `react-intl` to `v6.4.4`. Refs UIIN-2573.
* Remove error message when switch between apps. Fixes UIIN-2488.
* Make the Move actions available regardless of how user navigated to the record. Refs UIIN-2518.
* Sorting on the Instance's Holdings item table is not working, part 2. Fixes UIIN-2565.
* Promote a local instance to become a shared instance. Refs UIIN-2460.
* Consortial Central Tenant: Suppress Holdings detail view Action menu. Refs UIIN-2524.
* Consortial Central Tenant: Suppress Item detail view Action menu. Refs UIIN-2525.
* Consortial Central Tenant: Hide Instance Action Menu New Request option. Refs UIIN-2572.
* Add facet for members with holdings on Instances in Inventory Instances/Holdings/Items search. Refs UIIN-2395.
* Add Inventory Browse facet for Contributors & Subjects on Shared vs Local Instances. Regs UIIN-2400.
* Disable View source button for Source = FOLIO instances. Fixes UIIN-2570.
* Add Inventory Browse facet for Call numbers (item) on Shared vs Not shared Instances. Refs UIIN-2407.
* Add Browse facet for members with holdings on Instances in Contributors & Subject Browse. Refs UIIN-2415.
* Add permission to promote a local instance to shared. Refs UIIN-2571.
* Add `Held By` facet in Call number browse. Refs UIIN-2416.
* Item barcode redirects to the broken page in circ log. Fixes UIIN-2606.
* Bump the major versions of @folio/plugin-create-inventory-records optionalDependencies. Refs UIIN-2597.
* Instance 3rd pane: Add consortial holdings/item accordion. Refs UIIN-2410.
* Consortial Central Tenant: Handling Holdings and Item actions on the Instance detail view. Refs UIIN-2523.
* Hide Held by facet in Inventory contributor and subject browse. Refs UIIN-2591.
* Use `==` for exact phrase search in Advanced Search for all full-text and term fields. Refs UIIN-2612.
* Provide an instance `tenantId` to the PO line form when creating an order from the instance. Refs UIIN-2614.
* Bump @folio/stripes-acq-components dependency version to 5.0.0. Refs UIIN-2620.
* ECS: Check when sharing instance with source=MARC is complete before re-fetching it. Refs UIIN-2605.
* Update all facets after changing a term or selecting a facet option. Refs UIIN-2610.

## [9.4.12](https://github.com/folio-org/ui-inventory/tree/v9.4.12) (2023-09-21)
[Full Changelog](https://github.com/folio-org/ui-inventory/compare/v9.4.11...v9.4.12)

* Sorting on the Instance's Holdings item table is not working. Fixes UIIN-2528.
* Sorting on the Instance's Holdings item table is not working, part 2. Fixes UIIN-2565.

## [9.4.11](https://github.com/folio-org/ui-inventory/tree/v9.4.11) (2023-08-02)
[Full Changelog](https://github.com/folio-org/ui-inventory/compare/v9.4.10...v9.4.11)

* User with limited permissions gets an error modal when navigating to the Inventory app. Fixes UIIN-2510.

## [9.4.10](https://github.com/folio-org/ui-inventory/tree/v9.4.10) (2023-07-28)
[Full Changelog](https://github.com/folio-org/ui-inventory/compare/v9.4.9...v9.4.10)

* Introduce server side pagination for large volume of items. Fixes UIIN-2478.

## [9.4.9](https://github.com/folio-org/ui-inventory/tree/v9.4.9) (2023-07-10)
[Full Changelog](https://github.com/folio-org/ui-inventory/compare/v9.4.8...v9.4.9)

* Dedupe ID-list passed to `useBoundWithHoldings`. Further addresses UIIN-2478.

## [9.4.8](https://github.com/folio-org/ui-inventory/tree/v9.4.8) (2023-06-30)
[Full Changelog](https://github.com/folio-org/ui-inventory/compare/v9.4.7...v9.4.8)

* Fix useBoundWithHoldings for 100+ items. Fixes UIIN-2478.

## [9.4.7](https://github.com/folio-org/ui-inventory/tree/v9.4.7) (2023-06-27)
[Full Changelog](https://github.com/folio-org/ui-inventory/compare/v9.4.6...v9.4.7)

* When duplicating an item, the circulation history is duplicated when it should not be. Fixes UIIN-2469.

## [9.4.6](https://github.com/folio-org/ui-inventory/tree/v9.4.6) (2023-06-19)
[Full Changelog](https://github.com/folio-org/ui-inventory/compare/v9.4.5...v9.4.6)

* Rename `hrid` qindex for item to avoid collisions with holdings and instances. Fixes UIIN-2443.

## [9.4.5](https://github.com/folio-org/ui-inventory/tree/v9.4.5) (2023-04-03)
[Full Changelog](https://github.com/folio-org/ui-inventory/compare/v9.4.4...v9.4.5)

* Update success messages for ISRI. Refs UIIN-2343.

## [9.4.4](https://github.com/folio-org/ui-inventory/tree/v9.4.4) (2023-03-31)
[Full Changelog](https://github.com/folio-org/ui-inventory/compare/v9.4.3...v9.4.4)

* Update success messages for ISRI. Refs UIIN-2343.
* Retain searches and offsets in session storage, so they don't show up in other browser tabs, and clean them up after logging out. Fixes UIIN-2359.

## [9.4.3](https://github.com/folio-org/ui-inventory/tree/v9.4.3) (2023-03-28)
[Full Changelog](https://github.com/folio-org/ui-inventory/compare/v9.4.2...v9.4.3)

* Correctly reset facet state when X icon next to the facet label is clicked. Fixes UIIN-2351.
* Record count for "Subjects" doesn't match at browse and search result panes. Fixes UIIN-2347.
* Fix the query templates for searching by subject. Fixes UIIN-2364.

## [9.4.2](https://github.com/folio-org/ui-inventory/tree/v9.4.2) (2023-03-20)
[Full Changelog](https://github.com/folio-org/ui-inventory/compare/v9.4.1...v9.4.2)

* To support UX consistency, use the `stripes-components.saveAndClose` key for save and close button. Refs UIIN-2332.
* Lift the local state from `<CheckboxFacet>` into `facetsStore` in zunstand. Fixes UIIN-2350, UIIN-2351.
* Use correct reference to item resource. Fixes UIIN-2355.
* Record count for "Subjects" doesn't match at browse and search result panes. Fixes UIIN-2347.
* Correctly reset facet state when `X` icon next to the facet label is clicked. Fixes UIIN-2351.
* Fix the query templates for searching by `subject`. Fixes UIIN-2364.
* Avoid private paths in stripes-core imports. Refs UIIN-2367.
* Fixing tests due to changes in `react-virtualized-auto-sizer`. Fixes UIIN-2371.
* Update success messages for ISRI. Refs UIIN-2343.
* Retain searches and offsets in session storage, so they don't show up in other browser tabs, and clean them up after logging out. Fixes UIIN-2359.

## [9.4.1](https://github.com/folio-org/ui-inventory/tree/v9.4.1) (2023-03-15)
[Full Changelog](https://github.com/folio-org/ui-inventory/compare/v9.4.0...v9.4.1)

* Do not allow for item removal when an item has a loan with a status set to `Declared lost`. Fixes UIIN-2138.
* Do not allow for item removal when an item has a loan with a status set to `Awaiting delivery`. Fixes UIIN-2187.
* Fix max width for contributors column in Instances search. Fixes UIIN-2345.
* Retain search query, result list and page number after switching between Search and Browse searches. Refs UIIN-2337.
* Browse results are not updated when field with Subject/Contributor value is linked/unlinked. Fixes UIIN-2342.
* Browse results in Inventory are not cleared when browse input field is cleared. Fixes UIIN-2299.

## [9.4.0](https://github.com/folio-org/ui-inventory/tree/v9.4.0) (2023-02-23)
[Full Changelog](https://github.com/folio-org/ui-inventory/compare/v9.3.0...v9.4.0)

* Disable deletion of a bound-with title from the Edit Item view if the title is also directly linked.  Refs UIIN-2327.
* Sort the bound-with titles on View Item and Edit Item screens. Refs UIIN-2326.
* Add missing bound-with permissions to Item create and edit. Fixes UIIN-2328.
* Skip Item Actions menu "Mark as" heading when no mark actions are available. Refs UIIN-2331.
* Added the print button for the common users. Refs UIIN-2329.

## [9.3.0](https://github.com/folio-org/ui-inventory/tree/v9.3.0) (2023-02-20)
[Full Changelog](https://github.com/folio-org/ui-inventory/compare/v9.2.0...v9.3.0)

* Link from item view bound-with table's holdings HRID column to the holding view. Fixes additional part of UIIN-2195.
* Fix error on creating new item.  Fixes UIIN-2227.
* Missing holdings' source is populated in the UI with instance's. UIIN-2229.
* Unchecking the "Select all" checkbox on the 2nd page resets all  selection for quick export to MARC. UIIN-2232.
* Selecting a row with multiple Call number entries is failed UIIN-2240.
* `Inventory: Create order from instance` also grants delete POL permission. Refs UIIN-2241.
* Not actual "relatedRecordVersion" value sends when user saves "MARC Bib" record. UIIN-2244.
* Display bound-with items along with directly linked items at all associated holdings. Refs UIIN-2164.
* Browse refactor: Show instance result in third pane when Number of titles = `1`. Refs UIIN-2186.
* Optimistic locking error appears when user adds more than 1 tag to "Holdings" record. Fixes UIIN-2242.
* Fix holdings view bound-with table also displaying directly linked items. Fixes UIIN-2260.
* Display "Inactive" by inactive locations on instance view. Fixes UIIN-1970.
* Create a new instance search option. Fixes UIIN-2264.
* Add create/update widget to HRID Settings page. UIIN-2139.
* Do not fetch bound with data if the boundWithParts data is not present. Fixes UIIN-2272.
* Revert back to `all` operator for title (All) index. Fixes UIIN-2274.
* Warn on `sessionStorage` errors instead of swallowing them.
* Add `inventory-storage.bound-with-parts.collection.get` to `Inventory: All permissions`. Fixes UIIN-2273.
* Add `inventory-storage.bound-with-parts.collection.get` to `Inventory: View instances, holdings, and items`. Fixes UIIN-2273.
* Open item details view when searching by item barcode. Refs UIIN-2036.
* Use correct index when searching for `subject`. Fixes UIIN-2275.
* Inventory | App Context menu | Add new option | Inventory app search. Fixes UIIN-2265.
* ISRI: Update the Settings screen to allow multiple job profiles: Create/Edit. Refs UIIN-2248.
* ISRI: Update the Settings screen to allow multiple job profiles: View. Refs UIIN-2249.
* Users with browse permissions can delete inventory records. Refs UIIN-2283.
* Include browse permissions into Inventory permissions. Refs UIIN-2280.
* Browse Lists | Hyperlink one column to improve accessibility. Refs UIIN-2266.
* Rename `instances1` resource on `ItemsRoute` to avoid colliding with holding records. Refs UIIN-2289.
* Z39.50 Settings toasts have a typo. Refs UIIN-2256
* Accessibility check: ISRI Z39.50 integration profile: Create/Edit. Fixes UIIN-2250.
* Accessibility check: ISRI Z39.50 integration profile: View. Fixes UIIN-2251.
* ISRI: Update the Inventory modal for ISRI single source Imports. Refs UIIN-2252.
* ISRI: Update the Inventory modal for ISRI single source Overlays. Refs UIIN-2253.
* ISRI: Update the Inventory modal for ISRI single multi-source Imports. Refs UIIN-2254.
* ISRI: Update the Inventory modal for ISRI single multi-source Overlays. Refs UIIN-2255.
* Clean up the rest of the old "Browse" related code from "Search" route. Refs UIIN-2285.
* Wrong operator used in request when user selects a record in browse results. UIIN-2294.
* Open instance details pane in cases when single item is not found after search. Fixes UIIN-2301.
* Do not render item list before holding records are loaded. Fixes UIIN-2289.
* ISRI: Update the Settings create/edit screen to remove duplicated labels. Refs UIIN-2297.
* ISRI: Add job profile-related info icons to Z39.50 create/edit screen. Refs UIIN-2306.
* Display the effective location on the holdings view. Refs UIIN-1520.
* Reference MARC Authority record is opened when user clicks on the "MARC Authority" icon next to the controlled field. Refs UIIN-2302.
* Align the module with API breaking change (browse). Refs UIIN-2296.
* Bump quick-marc to 6.0.0. Refs UIIN-2310.
* Align subjects query building with API changes. Refs UIIN-2314.
* Cannot save new Z39.50 Settings profile due to missing required fields. Fixes UIIN-2298.
* Hide Export to json option in Action menu. Refs UIIN-2304.
* Bump `@folio/stripes-acq-components` version to `4.0.0`. Refs UIIN-2319.
* Create info popovers on call number fields in item record. Fixes UIIN-2307.
* Hyperlink one column in the results list to improve accessibility. Fixes UIIN-2176.
* Bump stripes to `8.0.0` for Orchid/2023-R1. Refs UIIN-2303.
* Improve the layout of the actions menu on the the item record. Fixes UIIN-2263.
* Block item deletion for items with status `Claimed returned`. Fixes UIIN-2136.
* Remove extra whitespace when parsing statistical code options. Fixes UIIN-2320.
* Delete bound-with parts. Refs UIIN-2001.
* Wire `<ErrorModal>` in cases of http errors during item and holding mutations. Fixes UIIN-2320.
* Added `<ControllableDetail>` component to display authorized indicator for Subjects, Uniform titles and Series. Refs UIIN-2311.
* Moved the print button from QuickMarkView, into the ViewSource. Due to the folio-org/ui-quick-marc#468. Refs UIIN-2324.
* Change title for the print popup. Refs UIIN-2329.
* Move @testing-library/* to dev-deps. Refs UIIN-2309.
* Rename `hrid` qindex for item to avoid collisions with holdings and instances. Fixes UIIN-2443.
* Reset `<BoundWithModal>` when modal is closed. Fixes UIIN-2401.

## [9.2.9](https://github.com/folio-org/ui-inventory/tree/v9.2.9) (2023-06-27)
[Full Changelog](https://github.com/folio-org/ui-inventory/compare/v9.2.8...v9.2.9)

* Use correct reference to item resource. Fixes UIIN-2418.
* When duplicating an item, the circulation history is duplicated when it should not be. Fixes UIIN-2470.

## [9.2.0](https://github.com/folio-org/ui-inventory/tree/v9.2.0) (2022-10-27)
[Full Changelog](https://github.com/folio-org/ui-inventory/compare/v9.1.0...v9.2.0)

* Supports interface 'users' 16.0.  Fixes UIIN-2210.
* Create Jest/RTL test for HoldingButtonsGroup.js. Refs UIEH-1746.
* Browse contributors | Instance search query does not include contributor Name type. Fixes UIIN-2096.
* Fix reference to `instanceSource` name. Fixes UIIN-2101.
* Fix Cannot add tags to Instance when unlinked preceding/succeeding titles present. Fixes UIIN-2084.
* Browse call numbers "records found" count is non-sensical. Refs UIIN-2093.
* Fix Query is copied to search field when navigating back and forth. Fix UIIN-2114.
* Browse contributors may show results floating amid blank rows. Fixes UIIN-2094.
* The table columns size changes when user return to the "Browse inventory" pane. Fixes UIIN-2106.
* Non-exact match placeholder message displayed when user switching between browse contributors result list pages. Fixes UIIN-2087.
* Browse contributors with special characters shows incomplete error message. Refs UIIN-2092.
* Fix import paths for stripes. Refs UIIN-2111.
* The "Instance" record still displayed at the third pane when user selects "Browse contributors" option. Fixes UIIN-2124.
* Escape quotes in browse string. Fix UIIN-2120.
* Browse contributors: # of results on the list is not the same as what the Contributors search returns. Refs UIIN-2134.
* Browse | The request doesn't send when user clicks on highlighted in bold contributor name. Fixes UIIN-2140.
* Incorrect format of the missing match in the call number browse. Refs UIIN-2141.
* Increase limit for fetching child/parents relations. Fixes UIIN-2150.
* The browse query changed when user returns from search to browse contributors pane. UIIN-2125.
* Do not load child/parent relations when navigating between two instances. Fixes UIIN-2129.
* Remove shelving order in search option. Fixes UIIN-2151.
* Clearing filters after clicking "Previous"/"Next" buttons in Inventory tab on Browse form. UIIN-2131.
* Also support `instance-storage` `9.0`. Refs UIIN-2162.
* Also support `holdings-storage` `6.0`. Refs UIIN-2162.
* Also support `item-storage` `10.0`. Refs UIIN-2162.
* Also support `inventory` `12.0`. Refs UIIN-2170.
* Request with operator "==/string" doesn't return the exact match results when search for contributor name. UIIN-2157.
* Fix clicking on the row by returning shelving order. UIIN-2171.
* Browse contributors | Second pane header doesn't update when user execute search by clicking contributor name. Fixes UIIN-2172.
* Add personal data disclosure form. Refs UIIN-1370.
* Escape quotes in search string. Fix UIIN-2143.
* Introduce in-memory pagination when loading parent/child instances. Fixes UIIN-2155.
* The placeholder for missing match is clickable on the Browse list. Fixes UIIN-2126.
* Reset `qindex` inside `buildQuery` in order for `queryTemplate` to be used correctly. Fixes UIIN-2189.
* No results return when you conduct a Contributor search. Fixes UIIN-2191.
* Browse contributors | Second pane header doesn't update when user return to "Browse inventory" pane via the web-browser "Back" button. Fixes UIIN-2181.
* Define new route for Inventory "Browse" page. Refs UIIN-2193.
* Do not include `highlightMatch` parameter in search queries. Fixes UIIN-2008.
* Relabel 'Bound-with titles' accordion on item view. Fixes UIIN-2196.
* Link from bound-with table HRID column to instances. Fixes UIIN-2195.
* Browse contributors | Show an indicator that contributor value is controlled/linked to an authority record. Refs UIIN-2179.
* View Instance record | Contributors accordion | Show authorized indicator for each contributor. Refs UIIN-2180.
* Move Inventory `Browse` logic into separate page: filters and result. Refs UIIN-2194.
* Ignore .vscode in .gitignore.
* Block item deletion for items with status "Awaiting pickup". Fixes UIIN-2086.
* Block item deletion for items with status "Aged to lost". Fixes UIIN-2136.
* The exact match result is NOT clickable on the browse result list (Contributors/Call numbers/ Subjects). Refs UIIN-2199.
* Add ability to search by notes in instances, holdings and items. Refs UIIN-942, UIIN-943, UIIN-944.
* Add ability to search by administrative notes in instances, holdings and items. Refs UIIN-2053.
* Add HRID and UUID to keyword search for instance, holdings, item. Refs UIIN-2198.
* Remove ability to sort by `publishers`. Fixes UIIN-2200.
* Fix `effectiveCallNumber` translation. Fixes UIIN-2165.
* Reorder the action menu on instance view. Fixes UIIN-2097.
* Add ability to choose blank state for all select fields on holdings form. Fixes UIIN-2121.
* Escape quotes in browse string. Fixes UIIN-2201.
* Single record import: when using the Back button in the browser, a duplicate import is no longer created. Fixes UIIN-2197.
* Display bound-with items in holdings view. Refs UIIN-2018.
* Link from bound-with items in holdings view to the item view. Refs UIIN-2212.
* Display "Inactive" by inactive locations on holdings and item views. Fixes UIIN-1968 and UIIN-1969.
* SRI: fetch up to 1000 SRI sources, sorted by name. Fixes UIIN-2206.
* Add ability to search by circulation notes in items. Refs UIIN-945.
* Add pagination for results list in `Browse` page. Refs UIIN-2202.
* Adjust title index to narrow the returned results. Fixes UIIN-2209.
* Quick instances export - add a select all option to Inventory search results
* Fix displaying item via item route. Fixes UIIN-2226.

## [9.1.0](https://github.com/folio-org/ui-inventory/tree/v9.1.0) (2022-06-28)
[Full Changelog](https://github.com/folio-org/ui-inventory/compare/v9.0.0...v9.1.0)

* Use permission search.facets.collection.get rather than
  search.instances.facets.collection.get. This was renamed some time
  after interface search 0.7 was bumped. Breaking change that is
  unfortunately not reflected in search interface. Fixes UIIN-1941.
* Fix Edit a MARC holdings record generates a 500 error. Fixes UIIN-1997.
* Reset search fields for each facet when "Reset all" button is clicked. Fixes UIIN-1977.
* The highlight of search results is not specific to the given search but now highlight all kinds of data in the record. Refs UIIN-1454.
* Fetch parent and child sub instances in one query. Fixes UIIN-1902.
* Missing Field - Receipt status under the Edit Holdings View. Fixes UIIN-1943.
* updated "Date ordered" label to "Date opened". Refs UIIN-1946.
* Call number and subject values are not surrounded by quotes when sending the request. Refs UIIN-1959.
* Browse form has hardcoded limit of the returned records. Refs UIIN-1957.
* search.holdings.ids.collection.get permission missing from package.json. Refs UIIN-1972.
* New Permission: View MARC holdings record . Refs UIIN-1973.
* Reset reference data resources on unmount. Fixes UIIN-1966.
* Do not cross-check tag facets with tag list. Refs UIIN-1974.
* Fix issues with re-entering ui-inventory when the instance details pane is opened. Fixes UIIN-1934.
* Incorrect rendering of returned records. Refs UIIN-1960.
* Improve `<RepeatableField>` layout. Fixes UIIN-1962.
* New Permission: View source (instance). Refs UIIN-1975.
* Do not change identifiers array for the preceding/succeeding titles. Fixes UIIN-1931.
* Fix missing label on holdings/item move view. Fixes UIIN-1927.
* Browse form flickers. Fixes UIIN-1961.
* Facets in Browse subjects and call numbers appear after reload page. Fixes UIIN-1965.
* Optimistic locking: display error message to inform user about OL. Refs UIIN-1987.
* Instances linked to package order lines are not displaying Order information. Fixes UIIN-1995.
* Remove expandAll parameter from browse requests. Refs UIIN-1990.
* Display correct location values in edit form after change. Fixes UIIN-1988.
* Correctly place (or omit) seprators between filters. Refs UIIN-1933.
* Eliminate timeout for counting holdings-records' items. Refs UIIN-2006.
* After using the Chrome "go back" button, following the link "Holdings Created" from Data import to
Inventory causes an error. Refs UIIN-2012.
* Update locations in `<ViewHoldingsRecord>` after edit. Fixes UIIN-1980.
* Retrieve up to 5000 locations when viewing Instances. Refs UIIN-2016.
* Remove `react-hot-loader`. Refs UIIN-1981.
* Search results with a single hit should automatically open the detail view. Fixes UIIN-2019.
* Fix inventory app white screen when no tags exist. Fixes UIIN-2030.
* Inventory > Update Instance search options dropdown with Browse contributors. Refs UIIN-2023.
* Fix inventory app crashes when viewing Holdings and locations don't exist. Fixes UIIN-2046.
* Creating an order from instance record. Add action to the Main Pane Header. Refs UIIN-547.
* Cannot read properties of undefined (reading 'shelfKey'). Refs UIIN-2038.
* Add Holdings UUID search option. Refs UIIN-911.
* Add Item UUID search option. Refs UIIN-912.
* Add OCLC search option. Refs UIIN-1208.
* Provide `CalloutContext.Provider` in the test harness to avoid `callout.sendCallout` NPEs.
* Select existing order when creating an order from instance record. Refs UIIN-2041.
* Add id attribute to Instance movement sections to use in e2e tests. Refs UIIN-2052.
* Inventory > Update Instance search options dropdown with Browse contributors. Refs UIIN-2023.
* Fix option View Source is not available in holdings record view. Refs UIIN-2044.
* Browse contributors list. Refs UIIN-2024.
* Normalize ISBNs for ISBN searching. Search option: Keyword (Instance, Holdings, Item). Refs UIIN-998.
* Normalize ISBNs for ISBN searching. Search option: Identifier (all) in the Instance segment. Refs UIIN-999.
* Browse form - first and last record navigation. Refs UIIN-1912.
* Inventory >  Contributors Browse - Create a Name Type facet. Refs UIIN-2021.
* Add filter/facet for Holdings > holdings type. Refs UIIN-1347.
* Fix when click view Holdings the Something went wrong error page appears. Refs UIIN-2063.
* Add filter/facet for instance status. Refs UIIN-1207.
* Fix Name Type facet sends requests to incorrect endpoint. Refs UIIN-2062.
* Browse Contributors: Hitting Next/Previous has odd behavior. Refs UIIN-2058
* Fix filters list doesn't update when user back to "Browse contributors" pane. Refs UIIN-2069.
* Applied filters don't reset when user select "Browse contributors" search option. Refs UIIN-2068.
* Create Jest/RTL test for PrimaryToggleButton. Refs UIIN-1666.
* Adjust query parameters on the subject browse form. Refs UIIN-2075.
* Improve query when search by call number. Refs UIIN-2078.
* Rename and reorder search options for clarity, consistency. Fixes UIIN-2060, UIIN-2061.
* Browse contributors. Placeholder match does not look right in the contributor column. Refs UIIN-2079.
* Create Jest/RTL test for HoldingButtonsGroup.js. Refs UIEH-1746.
* Item Circulation history: Items that has not been checked in, have the first Service point in the list of service points assigned in the UI. Refs UIIN-2109

## [9.0.0](https://github.com/folio-org/ui-inventory/tree/v9.0.0) (2022-03-03)
[Full Changelog](https://github.com/folio-org/ui-inventory/compare/v8.0.0...v9.0.0)

* Change Holdings record source to FOLIO when Duplicate Holdings record. Refs UIIN-1647.
* Save Holdings UUIDs in the Inventory search result. Refs UIIN-1662.
* Fix MARC Holdings record > View Source and Edit in quickMARC actions are not available. Fixes UIIN-1806
* Call read-only fields for FOLIO holdings endpoint to get list of read-only fields. Refs UIIN-1655.
* Add missing `search.instances.ids.collection.get` permission to `module.inventory.enabled`. Refs UIIN-1812.
* Fix parent and child relationship rendering. Fixes UIIN-1816 and UIIN-1814.
* Change PUT endpoint for Holdings editing. Refs UIIN-1660.
* Optimistic locking: update payload when update a marc record. Refs UIIN-1819.
* Bump data-export interface version to 5.0.
* Revert elastic search. Refs UIIN-1822.
* Use correct `css-loader` syntax. Refs UIIN-1826.
* Fix suppressed from discovery filter. Fixes UIIN-1832.
* Create a MARC Holdings Record. Refs UIIN-1828.
* Change search operators for ISBN and ISSN to '='. Fixes UIIN-1846.
* Allow user to sort receiving history table. Refs UIIN-1824.
* Change search operator for "Identifier (all)" index to '='. Fixes UIIN-1855.
* Fix successful toast appears after clicking on `In transit items report (CSV)`. Refs UIIN-1838.
* Add permission for marking item as `In process`. Fixes UIIN-1654.
* Holdings record with source MARC - do not allow user to delete mapped field values. Refs UIIN-1853.
* Use correct metadata on item form. Fixes UIIN-1656.
* Fix after saving and updating a holdings record, the user is returned to the instance record. Fixes UIIN-1854
* Retrieve and display Order information on Instance record. Refs UIIN-1835.
* Add date filters. Refs UIIN-1651, UIIN-1653.
* Integrate facets with existing query input. Refs UIIN-1870.
* Display acquisition accordion on Item record. Refs UIIN-1858.
* Item. Several keyboard shortcuts does not act on the item. Refs UIIN-1867.
* Holdings. Keyboard shortcuts does not act on the holdings. Refs UIIN-1866.
* Fix bug preventing circ history service point & source from appearing. Fixes UIIN-1558.
* Fix The Acquisition accordion is not unfolded automatically when there is data to be shown. Refs UIIN-1869.
* Expand acquisition accordion when displaying Order information on Instance record. Refs UIIN-1886.
* Also support `circulation` `12.0`. Refs UIIN-1861.
* SRS display. MARC indicators may be misaligned. Refs UIIN-1859.
* Add new data element `<AdministrativeNote>` to instances. Refs UIIN-1442.
* Add Browse call numbers option. Refs UIIN-1879.
* Add new data element `<AdministrativeNote>` to holdings. Refs UIIN-1443.
* Add new data element `<AdministrativeNote>` to items. Refs UIIN-1444.
* Browse form. Refs UIIN-1887.
* Add Browse subjects option. Refs UIIN-1880.
* Add ability to filter holding records by created date. Refs UIIN-791.
* Add ability to filter holding records by updated date. Refs UIIN-786.
* Add ability to filter item records by created date. Refs UIIN-789.
* Add ability to filter item records by updated date. Refs UIIN-786.
* Add ability to filter instance, holding and item records by statistical code. Refs UIIN-792, UIIN-793, UIIN-794.
* Set results list columns for "Browse subjects" functionality. Refs UIIN-1892.
* Call number browse result list - populate results. Refs UIIN-1884.
* Subject browse result list - populate results. Refs UIIN-1893.
* New/Edit Item Page - Accessibility Error: IDs used in ARIA and labels must be unique. Refs UIIN-1162.
* HRID handling. Settings - Accessibility Error: Form elements must have labels. Refs UIIN-1163.
* Create title level request from Instance record. Refs UIIN-1620.
* Inventory action menu link View & reorder queue. Refs UIIN-1881.
* Also support `circulation` `13.0`. Refs UIIN-1871.
* Create/Edit Holdings record > No indication that fields are required. Refs UIIN-1648.
* New/Edit Holdings Page - Accessibility Error: IDs of active elements must be unique. Refs UIIN-1159.
* Filters/facets on Subject browse form. Refs UIIN-1904.
* Create/Edit Item record > No indication that field(s) is required by screenreader and not using the FOLIO standard indication for required fields. Refs UIIN-1649.
* Selecting row from call number browse result list. UIIN-1888
* Filters/facets on Call number browse form. Refs UIIN-1882.
* Selecting row from subject browse result list. UIIN-1895
* Placeholder for the missing match. Refs UIIN-1889.
* New/Edit Instance Page - Accessibility Error: IDs of active elements must be unique. Refs UIIN-1155.
* Browse form - Reset all button. Refs UIIN-1913.
* Browse form - navigate to other Inventory tabs. Refs UIIN-1914.
* Display a conflict detection banner. Refs UIIN-1872.
* Add ability to filter holding records by source. Refs UIIN-1810.
* Call number browse form - filter by location. Refs UIIN-1915.
* Settings > Inventory > change focus. Refs UIIN-1908.
* Fix Call number indexes for holding records. Refs UIIN-1918.
* Fix Call number indexes for item records. Refs UIIN-1919.
* New/Edit Instance Page - Accessibility Error: Certain ARIA roles must be contained by particular parents. Refs UIIN-1154.
* Create/Edit Item Record - Required fields are not read by screenreader as required. Refs UIIN-1153.
* New/Edit Item Page - Accessibility Error: Some elements has insufficient color contrast of 3.3 and several elements with same id. Refs UIIN-1161.
* Accessibility Error: Form elements must have labels. Inventory landing page. Refs UIIN-1144.
* Matching call number should be in bold. Refs UIIN-1922.
* Add pagination to holding items. Fixes UIIN-1831.
* Accessibility Error: IDs of the elements must be unique. Refs UIIN-1145.
* Fix typo in permissions name. Fixes UIIN-1916.
* Fix movement of holdings records between instance records. Refs UIIN-1929.
* Update facet and search option names for holdings and items. Refs UIIN-1935.
* Refactor from `SafeHTMLMessage` to `FormattedMessage`. Refs UIIN-1525.
* Add 'all fields' search index. Refs UIIN-1645.
* Add browse permissions. Refs UIIN-1940

## [8.0.0](https://github.com/folio-org/ui-inventory/tree/v8.0.0) (2021-10-05)
[Full Changelog](https://github.com/folio-org/ui-inventory/compare/v7.1.4...v8.0.0)

* Add bound-with indicator to item view. Refs UIIN-1518.
* Show correct HRID for holdings record in detail view pane header. Refs UIIN-1470.
* Show pane subtitle for item view. Refs UIIN-1535.
* Holdings record. Show connected holding POLs in acq accordion. Refs UIIN-574.
* Keyboard cannot move item to other holding by drag 'n' drop. Refs UIIN-1490.
* Populate a value in Source field when View/Edit Inventory Holdings Record. Refs UIIN-1548.
* Improve performance on instance view. Fixes UIIN-1560.
* Fix instance duplication when child or parent records are present. Fixes UIIN-1562.
* Add bound-with icons and item detail view header note. Refs UIIN-1522, UIIN-1523, UIIN-1524.
* Add links to item view header and holdings view header. Refs UIIN-1500, UIIN-1501.
* Retrieve and display select Piece information on Holding. Refs UIIN-1502.
* Make sure building inventory module works with `babel-plugin-lodash`. Refs UIIN-1569.
* Implement keyboard shortcuts in Inventory. Refs UIIN-1411.
* Implement Keyboard Shortcut overview. Refs UIIN-1498.
* Fix inventory Holdings record is populated with Source=MARC with no underlying SRS record. Fixes UIIN-1570.
* Replace okapiInterfaces dependencies for inventory to `11.0`. Refs FOLIO-3179.
* Add accordion to `<ItemView>` for bound-with related items. Refs UIIN-1521.
* Add View source for MARC Holdings. Refs UIIN-1549.
* Item count bug when there are multiple holdings on an instance. Refs UIIN-1617.
* Update received piece table columns. Refs UIIN-1632.
* Restore `mod-inventory` endpoints for non-search requests. UIIN-1634.
* Delete Inventory and MARC holdings records when record Source = MARC. Refs UIIN-1559.
* Update react-final-form to 6.5.6 to fix breaking change.
* Increment `stripes` to `v7`, `react` to `v17`. Refs UIIN-1564.
* Edit MARC Holdings via quickMARC. Refs UIIN-1636.
* Instance record: Update Instance record Actions menu. Refs UIIN-1625.
* Add ability to move MARC holdings between instances. Refs UIIN-1633.
* Make mapped fields read-only for MARC holdings records. Refs UIIN-1639.

## [7.1.4](https://github.com/folio-org/ui-inventory/tree/v7.1.4) (2021-08-05)
[Full Changelog](https://github.com/folio-org/ui-inventory/compare/v7.1.3...v7.1.4)

* Sort statistical code types on Statistical code settings page. Refs UIIN-1547.

## [7.1.3](https://github.com/folio-org/ui-inventory/tree/v7.1.2) (2021-07-30)
[Full Changelog](https://github.com/folio-org/ui-inventory/compare/v7.1.2...v7.1.3)

* Fix collapse and expand buttons on instance view. Fixes UIIN-1556.
* Sort statistical codes by code-type, then code, then name. Refs UIIN-1550.

## [7.1.2](https://github.com/folio-org/ui-inventory/tree/v7.1.2) (2021-07-14)
[Full Changelog](https://github.com/folio-org/ui-inventory/compare/v7.1.1...v7.1.2)

* Update `stripes` to `^6.2.0` and `stripes-core` to `^7.2.0`.

## [7.1.1](https://github.com/folio-org/ui-inventory/tree/v7.1.1) (2021-07-14)
[Full Changelog](https://github.com/folio-org/ui-inventory/compare/v7.1.0...v7.1.1)

* Parse `parentInstances` and `childInstances` before instance record is saved. Fixes UIIN-1546.
* Unfold instance relationship accordion when relationships are present. Fixes UIIN-1534.

## [7.1.0](https://github.com/folio-org/ui-inventory/tree/v7.1.0) (2021-06-18)
[Full Changelog](https://github.com/folio-org/ui-inventory/compare/v7.0.3...v7.1.0)

* Improve relationship with parent and child instances. Refs UIIN-1044.
* Move items among holdings, even if the list of holdings is loooooooooong. Refs UIIN-1446.
* Allow the `limit` for the locations query to be specified via stripes config. Refs UIIN-1480.
* Add visual display when holdings record is suppressed from discovery. Refs UIIN-1378.
* Add visual display when instance is suppressed from discovery. Refs UIIN-1377 and UIIN-1386.
* Use the `contributorsNames` index, available in `inventory` since `10.10`. Refs UIIN-1451.
* Add a warning icon for instance/holdings/item marked as Suppressed from discovery. Refs UIIN-1380.
* Add a warning icon for instance marked as Staff suppressed. Refs UIIN-1381.
* Add visual display when item is suppressed from discovery. Refs UIIN-1379.
* Also support `circulation` `10.0`. Refs UIIN-1488.
* Fix date display on item view. Fixes UIIN-1481.
* Display correct open-request count for items. Refs UIIN-1469.
* Fix items in transit export. Fixes UIIN-1492.
* Warn with yellow toast when result of Single Record Import is unknown. Fixes UIIN-1495.
* Patch: Display shelving order on the item record. Refs UIIN-816.
* Add <Pluggable> instance to the Instance action menu for plugin type `copyright-permissions-checker`.
* Add callout after instance record is saved. Refs UIIN-1468.
* Add callout after item or holdings record are saved. Refs UIIN-1485, UIIN-1486.
* Also support `circulation` `11.0`. Refs UIIN-1511.
* Update "remote-storage-mappings" interface. Refs UIIN-1512.
* Fix stripes import paths. Refs UIIN-1516.
* Focus on on search box when changing inventory segments. Fixes UIIN-1358.
* Update detail view headers. Refs UIIN-1309, UIIN-1311, UIIN-1470.
* Update version of interfaces due to supporting MARC Authority records. Refs UIIN-1528.
* Show error modal when saving instance fails. Fixes UIIN-1527.
* Fix impossibility to create `in transit` items report. Refs UIIN-1642.

## [7.0.4](https://github.com/folio-org/ui-inventory/tree/v7.0.4) (2021-06-18)
[Full Changelog](https://github.com/folio-org/ui-inventory/compare/v7.0.3...v7.0.4)

* Fix instance MARC record not loading when adding OCLC number. Refs UIIN-1532.

## [7.0.3](https://github.com/folio-org/ui-inventory/tree/v7.0.3) (2021-04-30)
[Full Changelog](https://github.com/folio-org/ui-inventory/compare/v7.0.2...v7.0.3)

* Patch: Display shelving order on the item record. Refs UIIN-816.

## [7.0.2](https://github.com/folio-org/ui-inventory/tree/v7.0.2) (2021-04-23)
[Full Changelog](https://github.com/folio-org/ui-inventory/compare/v7.0.1...v7.0.2)

* Warn with yellow toast when result of Single Record Import is unknown. Fixes UIIN-1495.
* Fix items in transit export. Fixes UIIN-1492.

## [7.0.1](https://github.com/folio-org/ui-inventory/tree/v7.0.1) (2021-04-22)
[Full Changelog](https://github.com/folio-org/ui-inventory/compare/v7.0.0...v7.0.1)

* Display correct open-request count for items. Refs UIIN-1469.
* Fix date display on item view. Fixes UIIN-1481.

## [7.0.0](https://github.com/folio-org/ui-inventory/tree/v7.0.0) (2021-04-15)
[Full Changelog](https://github.com/folio-org/ui-inventory/compare/v6.0.0...v7.0.0)

* It is possible to configure the maximum number of location to fetch in the Stripes config file, typically `stripes.config.js`, using the `maxUnpagedResourceCount` entry in the `config` area. Fixes UIIN-1480.
* Unable to move item to separate holding (same instance) when list of items scrolls down and off the screen. Refs UIIN-1446
* Use the `contributorsNames` index, available in `inventory` since `10.10`. Refs UIIN-1451.
* Lock `stripes-cli` to `~2.1.1`, and thus `stripes-webpack` to `~1.1.0`. See STCLI-176.

## [6.0.0](https://github.com/folio-org/ui-inventory/tree/v6.0.0) (2021-03-18)
[Full Changelog](https://github.com/folio-org/ui-inventory/compare/v5.0.6...v6.0.0)

* Assign tags to Inventory Items. Refs UIIN-309.
* Filter Item by Tags. Refs UIIN-765.
* Filter Holdings by Tags. Refs UIIN-764.
* Assign tags to Inventory Holdings. Refs UIIN-308.
* Filter Instance by Tags. Refs UIIN-763.
* Assign tags to Inventory Instances. Refs UIIN-307.
* Move 'Material type' to far end of item table. Refs UIIN-1003.
* Remove `onChangeIndex` prop passed to `SearchAndSort`. Fixes UIIN-1299.
* Remove extraneous trailing slash. Refs UIIN-1316.
* Show the number of open requests when the item status changes. Refs UIIN-1294.
* Fix search by `identifierTypes`. Fixes UIIN-1312.
* Omit `id` from preceding/succeeding titles when duplicating instance. Fixes UIIN-1324.
* Add info callout when saving file with the instance UUIDs takes longer. Refs UIIN-1329.
* Do not escape quotes when submitting query-search queries. Refs UIIN-1319, UIIN-1320.
* Use `TextArea` for some data fields on instance form. Refs UIIN-1278.
* Return promise when submitting instance, holdings record or item form. Fixes UIIN-1339 and UIIN-1340.
* Add select row checkboxes to inventory instance search result. Refs UIIN-1349.
* Implement records selection on the inventory search screen. Refs UIIN-1350.
* Replace most holdings-record `<TextField>` elements with `<TextArea>`s to support scrolling. Refs UIIN-1279.
* Replace some item record `<TextField>` elements with `<TextArea>`s to support scrolling. Refs UIIN-1280.
* Add selected instances count in the sub header. Refs UIIN-1364.
* Update title in Holdings detailed view. Fixes UIIN-1310.
* Modify display of statistical codes in instance detail view. Refs UIIN-1150.
* Result list. Align text in the columns in the top. Refs UIIN-1356.
* Update API endpoint for retrieving instances UUIDs. Refs UIIN-1368.
* Make holdings sources with source value `folio` non-editable in Settings. Refs UIIN-1314.
* Add quick instances UUIDs export limit reached warning. Refs UIIN-1367.
* Refactor the suppress actions in `Settings` into a single util function. Refs UIIN-1373.
* Clean up display of instance and item detail record headers (remove 'dead' icons). Refs UIIN-1361.
* Upgraded to create-inventory plugin v2.0.0.
* Include missing item-status values. Refs UIIN-1385.
* Disable sorting by `relation` column. Refs UIIN-1303.
* Add show selected records action menu. Refs UIIN-1375.
* Implement quick export of instances in MARC Bib output format. Refs UIIN-1382.
* Add jest setup. Refs UIIN-1375.
* Cover select instances functionality with jest/rtl tests. Refs UIIN-1390.
* Fix type ahead for location filters. Fixes UIIN-1393 and UIIN-1395.
* Add checkboxes on the show selected instances records modal. Refs UIIN-1391.
* Update to stripes v6. Refs UIIN-1402.
* Add ability to mark item as Intellectual item and Restricted. Refs UIIN-1374.
* Add permission for marking an item intellectual. Refs UIIN-1336.
* Add permission for marking an item restricted. Refs UIIN-1335.
* Add confirmation and warning when storage locations is changed to non-remote storage location. Refs UIIN-1321.
* Add ability to mark an item with new statuses (In process, In process (non-requestable), Long missing, Unavailable, Unknown). Refs UIIN-756.
* Add option to remove leading zeroes from Inventory HRIDs. Refs UIIN-1398.
* Add ability to switch between new item statuses. Refs UIIN-1305.
* Add option to remove leading zeroes from Inventory HRIDs. Refs UIIN-1398
* Add support for maintaining copy-cataloguing profiles in the settings area. Fixes UIIN-1401. Entails adding new interface `copycat-profiles`.
* Add support for importing MARC records from external Z39.50 sources. Fixes UUIN-1317 and UUIN-1318. Entails adding new interface `copycat-imports`.
* When multiple Z39.50 services are configured, offer a choice at import time. Fixes UIIN-1426.
* Modify language of Import Record modal when updating a record. Fixes UIIN-1424.
* Inventory app now degrades gracefully in the absence of mod-copycat. Fixes UIIN-1428.
* Modify language of Settings/Inventory/Single record import. Fixes UIIN-1429.
* Disable the single-record-import modal's Import button until something has been entered. Fixes UIIN-1431.
* Better settings UI for maintaining copycat targets. Fixes UIIN-1437.
* In "Z39.50 target profiles" settings, support the `targetOptions` field. Fixes UIIN-1445.
* Update to `stripes-cli v2.0.0`. Refs UIIN-1410.
* Show new request option for item with status restricted. Refs UIIN-1306.
* Connect the `Remove leading zeroes from HRID` field to the `HRID handling` form. Refs UIIN-1413.
* Rename `Settings (Inventory): Display list of settings pages` permission to `Settings (Inventory): View list of settings pages`. Refs UIIN-1399.
* Add ability to duplicate MARC bib record. Refs UIIN-1407.
* Add permission for marking item as In process (non-requestable), Long missing, Unavailable, Unknown. Refs UIIN-1308, UIIN-894, UIIN-1307, UIIN-1326.
* Parse `item.enumeration` numerically for sorting if possible. Refs UIIN-1412.
* Allow the selection of remote storage locations. Refs UIIN-1290.
* Add ability to search by `allTitles` index. Refs UIIN-1434.
* Add `tags.collection.get` as subpermission to `Inventory: View instances, holdings, and items` permission. Fixes UIIN-1422.
* Display shelving order on the item record. Refs UIIN-816.
* Passed the same ID down to the instance details pane and the loading pane. Fixes UIIN-1384.
* Add item counter to each holding record. Refs UIIN-803.
* Fix instance format filter. Refs UIIN-1423.
* Change label Duplicate MARC bib record to Derive new MARC bib record. Refs UIIN-1436.
* Fix nature of content filter. Fixes UIIN-1441.
* Update `data-export` interface to `4.0`. Refs UIIN-1448.
* Update `@folio/react-intl-safe-html`, `@folio/plugin-find-instance`, and `@folio/quick-marc` for compatibility with `@folio/stripes` `v6`.
* Unable to move item to separate holding (same instance) when list of items scrolls down and off the screen. Refs UIIN-1446

## [5.0.6](https://github.com/folio-org/ui-inventory/tree/v5.0.6) (2021-01-14)
[Full Changelog](https://github.com/folio-org/ui-inventory/compare/v5.0.5...v5.0.6)

* Fix type ahead for location filters. Fixes UIIN-1393 and UIIN-1395.

## [5.0.5](https://github.com/folio-org/ui-inventory/tree/v5.0.5) (2020-11-18)
[Full Changelog](https://github.com/folio-org/ui-inventory/compare/v5.0.4...v5.0.5)

* Return promise when submitting instance, holdings record or item form. Fixes UIIN-1339 and UIIN-1340.

## [5.0.4](https://github.com/folio-org/ui-inventory/tree/v5.0.4) (2020-11-16)
[Full Changelog](https://github.com/folio-org/ui-inventory/compare/v5.0.3...v5.0.4)

* Do not escape quotes when submitting query-search queries. Refs UIIN-1319, UIIN-1320.

## [5.0.3](https://github.com/folio-org/ui-inventory/tree/v5.0.3) (2020-11-12)
[Full Changelog](https://github.com/folio-org/ui-inventory/compare/v5.0.1...v5.0.3)

* Move 'Material type' to far end of item table. Refs UIIN-1003.
* Remove extraneous trailing slash. Refs UIIN-1316.
* Show the number of open requests when the item status changes. Refs UIIN-1294.
* Fix search by `identifierTypes`. Fixes UIIN-1312.
* Omit `id` from preceding/succeeding titles when duplicating instance. Fixes UIIN-1324.

## [5.0.1](https://github.com/folio-org/ui-inventory/tree/v5.0.1) (2020-10-15)
[Full Changelog](https://github.com/folio-org/ui-inventory/compare/v5.0.0...v5.0.1)

* Update plugins to `stripes v5`-compatible versions. Refs UIIN-1301.

## [5.0.0](https://github.com/folio-org/ui-inventory/tree/v5.0.0) (2020-10-14)
[Full Changelog](https://github.com/folio-org/ui-inventory/compare/v4.0.1...v5.0.0)

* Display `Instance match key` field if `Instance.matchKey` present in back end UIIN-1293.
* Viewing Item Requests on Instance Record. Addresses UIIN-977.
* Altering validation code to check for unique statistical code name.  Addresses UIIN-1276.
* Modified permissions and built permission checking into fast add button.  Addresses UIIN-1210.
* Changed value of 'shouldRefresh' in statistical code settings.  Addresses UIIN-1268
* Reverting problematic code refactor in fix of UIIN-1259.
* Fixed validator fucntion for statitical codes settings.  Addresses UIIN-1259.
* changed order of items on holdings record action menu.  Addresses UIIN-1093.
* removed link around awaiting pickup status in item detail view.  Addresses UIIN-1185.
* removed "recieved" status from search and sort menu.  Addresses UIIN-1199.
* corrected icon for fast add dropdown option.  Addresses UIIN-907.
* Add an fast add record button to action menu.  Addresses UIIN-907.
* Move and confirm items and holdings or items to a new instance. Refs UIIN-1101.
* Add Item screen : Incorrect aria label. Refs UIIN-1104.
* Select and move holdings with items or items to another instance. Refs UIIN-1098.
* Move items between holdings. Refs UIIN-1097.
* Update Requests to SRS for v4. Refs UIIN-1158.
* Show two instance records as a split screen. Refs UIIN-1103.
* Add filter for the instance source. Refs UIIN-1132.
* Increment `@folio/plugin-find-instance` to `v3.0` for `@folio/stripes` `v4` compatibility.
* Clear detail record pane after new search is performed. Refs UIIN-1074.
* Make language-filter labels translatable. Fixes UIIN-829.
* Add effective location to item list table. Refs UIIN-1124.
* Continue working in Inventory after moving holding(s) and/or item(s). Refs UIIN-1111.
* Show new request action for checked out items. Fixes UIIN-1188.
* Show new request action for on order items. Fixes UIIN-1187.
* Add `Edit in quickMARC` link disabled state condition. Refs UIIN-1191
* Action menu view source in split screen instance records. Refs UIIN-1112.
* Increment `@folio/stripes` to `v5`, plus corresponding dev-dep increments.
* Possible error for Source=FOLIO instances has been fixed. Refs UIIN-1190.
* Action menu edit in split screen instance records. Refs UIIN-1116.
* Validate presence of resources before accessing them. Refs UIIN-1203, STCON-111.
* Disable fields in Preceding/Succeeding section, when Instance is controlled by Source MARC. Fixes UIIN-1128.
* Fix Edit in quickMARC and View Source options state after instance editing. Refs UIIN-1204.
* Change request status for `Awaiting delivery` items marked as missing. Fixes UIIN-1206.
* In transit report does not export name of library. Refs UIIN-1058.
* `Holdings - Call number, eye readable`. Add search only by the call number. Refs UIIN-1040.
* Replace `bigtest/mirage` with `miragejs`.
* `Item - Effective call number (item), eye readable`. Add search only by the call number. Refs UIIN-1041.
* Move (right to left) and confirm items and holdings or items to a new instance. Refs UIIN-1152.
* Add item `aged to lost` status. Refs UIIN-1006.
* Move items/holdings error message. Refs UIIN-1186.
* Add loan type to items list. Refs UIIN-1004.
* Add public and staff notes to `Holdings statements`. Refs UIIN-1215.
* Moving holdings and items permissions. Refs UIIN-1120.
* Drag and drop accessibility. UIIN-1127.
* Confirm items before moving to different holdings and/or instances. UIIN-1226.
* Hide an empty list when there are no items in `Holdings` record. Refs UIIN-1076.
* Add settings page for fast add. Refs UIIN-1211.
* Increment `react-intl` to `v5`. Refs UIIN-1252.
* Create permission for Settings -> Inventory -> Fast add. Refs UIIN-1257.
* Implement easy way to copy HRID in the Item record. Refs UIIN-1002.
* Implement easy way to copy Barcode in the Item record. Refs UIIN-1250.
* Implement easy way to copy HRID in the Holdings record. Refs UIIN-1001.
* Implement easy way to copy HRID in the Instance record. Refs UIIN-1000.
* Add Holdings sources to settings. Refs UIIN-1229.
* Add Holdings source to holdings view and edit screens. Refs UIIN-1123.
* Highlight results when searching for item barcode. Refs UIIN-906.
* Move dictionary data fetching above router. Fixes UIIN-1265.
* Show service point an item was sent to. Refs UIIN-934.
* Fix permission for mark as missing action. Fixes UIIN-1272.
* Mark connected preceding and succeeding titles as connected. Fixes UIIN-1283.
* Implement instances search query saving to cql file instead of csv. Refs UIDEXP-155.
* Instance record (detailed view). Add copy number to item list. Refs UIIN-1251.
* Instance record (detailed view). Add holdings copy number to holdings accordion. Refs UIIN-1254.
* Use `<MultiSelectionFilter>` for item status filter. Refs UIIN-1224.
* Correctly filter languages pursuant to STCOM-492. Refs UIIN-1287.
* Show `No barcode` for items without barcode. Fixes UIIN-1288.

## [4.0.1](https://github.com/folio-org/ui-inventory/tree/v4.0.1) (2020-07-01)
[Full Changelog](https://github.com/folio-org/ui-inventory/compare/v4.0.0...v4.0.1)

* Show new request action for on order items. Fixes UIIN-1187.
* Show new request action for checked out items. Fixes UIIN-1188.

## [4.0.0](https://github.com/folio-org/ui-inventory/tree/v4.0.0) (2020-06-25)
[Full Changelog](https://github.com/folio-org/ui-inventory/compare/v3.0.2...v4.0.0)

* Update Requests to SRS for v4. Refs UIIN-1158.

## [3.0.2](https://github.com/folio-org/ui-inventory/tree/v3.0.2) (2020-06-23)
[Full Changelog](https://github.com/folio-org/ui-inventory/compare/v3.0.1...v3.0.2)

* Disable fields in Preceding/Succeeding section, when Instance is controlled by Source MARC. Refs UIIN-1128.
* Try harder to maintain default title sort when searching or filtering. Fixes UIIN-1046.

## [3.0.1](https://github.com/folio-org/ui-inventory/tree/v3.0.1) (2020-06-19)
[Full Changelog](https://github.com/folio-org/ui-inventory/compare/v3.0.0...v3.0.1)

* Increment `@folio/plugin-find-instance` to `v3.0` for `@folio/stripes` `v4` compatibility.

## [3.0.0](https://github.com/folio-org/ui-inventory/tree/v3.0.0) (2020-06-16)
[Full Changelog](https://github.com/folio-org/ui-inventory/compare/v2.0.0...v3.0.0)

* Preceding and Succeeding titles. Clicking on connected titles should open in the same window. Fixes UIIN-1037.
* Display instance status date with status. Refs UIIN-1007.
* Import `stripes-util` via `stripes`. Fixes UIIN-1021 and UIIN-1029.
* Rewrite accordion state control. Fixes UIIN-921.
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
* Security update eslint to >= 6.2.1 or eslint-util >= 1.4.1. Fixes UUIN-940.
* Make the string to be wrapped with a space symbol in Preceding and Succeeding titles. Fixes UIIN-1036.
* Show error callout when saving file with the instance UUIDs fails. UIDEXP-55.
* Add filter for instance date updated. Refs UIIN-790.
* Pin `moment` at `~2.24.0` in light of multiple issues with `2.25.0` ([5489](https://github.com/moment/moment/issues/5489), [5472](https://github.com/moment/moment/issues/5472)).
* Purge `intlShape` in prep for `react-intl` `v4` migration. Refs STRIPES-672.
* Add ability to search by `Effective call number (item), normalized` option. Refs UIIN-993.
* Add ability to search by `Call number, normalized` option via holdings segment. Refs UIIN-983.
* Show/hide specific options in Actions menu for the `Withdrawn` item. Refs UIIN-818.
* Prevent items with the status `Claimed returned` from being marked missing. Refs UIIN-891.
* Add ability to search item by `Claimed returned` status. Refs UIIN-957.
* Add permission for marking an item withdrawn. Refs UIIN-889.
* Allow users to search & filter for items with the status Lost and paid. Refs UIIN-895.
* Holdings record. Add space between: Suppress from Discovery and HRID. Fixes UIIN-477
* Upgrade to `stripes` `4.0`, `react-intl` `4.5`. Refs STRIPES-672.
* Subheading Related title to be deprecated. Instance (edit view) Fixes UIIN-1032
* Preceding and Succeeding titles. Make the Connected label less prominent (edit view) Fixes UIIN-1039
* Subheading Related title to be deprecated. Instance (edit view). Fixes UIIN-1032.
* Preceding and Succeeding titles. Make the Connected label less prominent (edit view). Fixes UIIN-1039.
* Item record: "loan type" appears as "loantype" (on detailed view). Fixes UIIN-657.
* Restore displaying of `Nature of content` value in Instance detailed view. Fixes UIIN-1100.
* Prefer `stripes.actsAs` to the deprecated `stripes.type` in `package.json`. Refs STCOR-148.
* Instance record. Relabel in the UI the Metadata source to Source (View and Edit) Fixes UIIN-1133
* Make permission names l10nable. UIIN-1137.

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
* Closing the 'View MARC' record takes you to a different app instead of the Instance details, sometimes. Fixes UIIN-1289.

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
