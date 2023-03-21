import create from 'zustand';

// Facets store contains a global state related
// to facets.
// Currently it only holds facetSettings which
// represents a state (searchValue and isOnMoreClicked)
// for each facet.
const facetsStore = create((set) => ({
  facetSettings: {},
  setFacetSettings: (name, value) => {
    set(state => {
      state.facetSettings = {
        ...state.facetSettings,
        [name]: {
          ...state.facetSettings[name],
          ...value,
        },
      };
    });
  },
  resetFacetSettings: () => set({ facetSettings: {} }),
  resetFacetByName: (name) => {
    set(state => {
      delete state.facetSettings[name];
    });
  }
}));

// selectors
export const getSearchTerm = (name) => {
  return facetsStore.getState().facetSettings?.[name]?.value ?? '';
};

// hooks
export const useFacetSettings = () => facetsStore(store => [
  store.facetSettings,
  store.setFacetSettings,
]);
export const useResetFacetSettings = () => facetsStore(store => store.resetFacetSettings);
export const useSearchValue = name => facetsStore(store => store.facetSettings?.[name]?.value);

export default facetsStore;
