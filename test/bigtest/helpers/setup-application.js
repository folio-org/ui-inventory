import setupStripesCore from '@folio/stripes-core/test/bigtest/helpers/setup-application';
import mirageOptions from '../network';

export default function setupApplication({
  scenarios,
  permissions = {},
  hasAllPerms = true,
  modules,
} = {}) {
  setupStripesCore({
    mirageOptions,
    scenarios,
    permissions,
    modules,
    stripesConfig: {
      hasAllPerms
    }
  });
}
