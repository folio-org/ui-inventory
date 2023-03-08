
export const getItem = (name, { fromLocalStorage } = {}) => {
  try {
    const storage = fromLocalStorage ? localStorage : sessionStorage;

    return JSON.parse(storage.getItem(name));
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn(`the value ${name} could not be retrieved due to an error`, e);
    return null;
  }
};

export const setItem = (name, value, { toLocalStorage } = {}) => {
  try {
    const storage = toLocalStorage ? localStorage : sessionStorage;

    storage.setItem(name, JSON.stringify(value));
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn(`the value ${name} could not be stored due to an error`, e);
  }
};

export const removeItem = (name, { fromLocalStorage } = {}) => {
  const storage = fromLocalStorage ? localStorage : sessionStorage;

  storage.removeItem(name);
};
