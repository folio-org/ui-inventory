const prefixKeys = (obj, prefix = 'stripes-data-transfer-components') => {
  const res = {};

  for (const key of Object.keys(obj)) {
    res[`${prefix}.${key}`] = obj[key];
  }

  return res;
};

export default prefixKeys;
