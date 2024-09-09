export const DATE_LENGTH = 4;

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

export const validateDates = (instance, errors, dateLengthMessage) => {
  errors.dates = {};

  const date1Length = instance.dates?.date1?.length;
  const date2Length = instance.dates?.date2?.length;

  // dates are not required, so the can be empty, but if they're not empty - they must be 4 characters long
  if (date1Length && date1Length !== DATE_LENGTH) {
    errors.dates.date1 = dateLengthMessage;
  }

  if (date2Length && date2Length !== DATE_LENGTH) {
    errors.dates.date2 = dateLengthMessage;
  }
};

export default {};
