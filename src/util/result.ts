import { Err, Ok } from 'space-lift';

export interface SimpleError<T extends string> {
  type: T;
  errorObject?: any;
  message?: string;
}

export type NotSimpleError<T> = Exclude<T, SimpleError<string>>;

export function isSimpleError(object: any): object is SimpleError<string> {
  return 'type' in object;
}

export function isResult(object: any): object is Result<any, any> {
  return !!object && (object.type === 'ok' || object.type === 'err');
}

export type Result<E extends string, T> = RawResult<SimpleError<E>, T>;

export type RawResult<E, T> = Ok<unknown, T> | Err<E, unknown>;
