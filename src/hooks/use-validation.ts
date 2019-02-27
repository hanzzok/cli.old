import { Validator } from 'validation.ts';
import { NotSimpleError, SimpleError } from '../util/result';
import { useResult } from './use-result';

export type ValidationErrors = 'validation::fail';

export function useValidation<T>(
  validator: Validator<NotSimpleError<T>>,
  object: any
) {
  return useResult<ValidationErrors, T>(
    validator
      .validate(object)
      .mapError<SimpleError<ValidationErrors>>(_ => ({
        type: 'validation::fail'
      }))
      .get()
  )[0];
}
