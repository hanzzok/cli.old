import { array, object, optional, string, Value } from 'validation.ts';
import { unwrap } from './util/result-unwrap';

export const ConfigurationValidator = object({
  blockConstructors: optional(array(string)),
  decorators: optional(array(string)),
  extends: optional(string),
  ignore: optional(array(string)),
  platform: string,
  presets: optional(array(string)),
  processors: optional(
    object({
      post: optional(array(string)),
      pre: optional(array(string))
    })
  )
});

export type Configuration = typeof ConfigurationValidator.T;

export function validateConfiguration(value: Value): Configuration {
  return unwrap(ConfigurationValidator.validate(value));
}
