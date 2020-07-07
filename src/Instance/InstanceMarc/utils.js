export const isControlField = field => (Object.keys(field)[0]).startsWith('00');

export const normalizeIndicator = indictor => indictor.replace(/\\/g, ' ');
