const trait = (afterCreate) => {
  return {
    extension: {
      afterCreate
    },
    __isTrait__: true
  };
};

export default trait;
