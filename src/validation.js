const DATE_LENGTH = 4;

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

export const validateDates = (instance, errors, dateLengthMessage, dateTypeMessage) => {
  errors.dates = {};

  if (instance.dates?.date1?.length !== DATE_LENGTH) {
    errors.dates.date1 = dateLengthMessage;
  }

  if (instance.dates?.date2?.length !== DATE_LENGTH) {
    errors.dates.date2 = dateLengthMessage;
  }
};

export default {};
