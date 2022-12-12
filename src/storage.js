
export const getItem = (name) => {
  try {
    return JSON.parse(sessionStorage.getItem(name));
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn(`the value ${name} could not be retrieved due to an error`, e);
    return null;
  }
};

export const setItem = (name, value) => {
  try {
    sessionStorage.setItem(name, JSON.stringify(value));
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn(`the value ${name} could not be stored due to an error`, e);
  }
};
