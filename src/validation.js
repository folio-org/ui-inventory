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

export const validateSubInstances = (instance, type, errors, message) => {
  const errorList = [];

  instance[type] = (instance?.[type] ?? []).forEach((inst, index) => {
    const { instanceRelationshipTypeId } = inst;

    if (!instanceRelationshipTypeId) {
      errorList[index] = { instanceRelationshipTypeId: message };
    }
  });

  if (errorList.length) {
    errors[type] = errorList;
  }
};

export default {};
