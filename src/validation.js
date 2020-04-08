export const validateTitles = (instance, type, errors, message) => {
  const titleAttr = `${type}Titles`;
  const errorList = [];

  instance[titleAttr] = (instance?.[titleAttr] ?? []).forEach((inst, index) => {
    const { title } = inst;
    if (!title) {
      errorList[index] = { title: message };
    }
  });

  if (errorList.length) {
    errors[titleAttr] = errorList;
  }
};

export default {};
