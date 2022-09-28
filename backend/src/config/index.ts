import { createConfigLoader } from 'neat-config';
import { configSchema } from './parts';
import { fragments } from './fragments';

export const config = createConfigLoader()
  .addFromEnvironment('CONF_')
  .addFromCLI('conf-')
  .addFromFile('.env')
  .addFromFile('config.json')
  .addJOISchema(configSchema)
  .setFragmentKey('usePresets')
  .addConfigFragments(fragments)
  .load();
