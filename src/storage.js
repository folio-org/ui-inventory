
export const getItem = (name) => {
  try {
    return JSON.parse(sessionStorage.getItem(name));
  } catch (e) {
    return null;
  }
};

export const setItem = (name, value) => {
  try {
    sessionStorage.setItem(name, JSON.stringify(value));
  } catch (e) {
    //
  }
};
