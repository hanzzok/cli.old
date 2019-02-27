import { Dispatch, SetStateAction, useState } from 'react';
import { Err, Ok } from 'space-lift';
import {
  isResult,
  isSimpleError,
  NotSimpleError,
  RawResult,
  Result,
  SimpleError
} from '../util/result';

export type BaseError = 'unset';

type ResultAlias<E extends string, R> = Result<E, R>;

type Value<E extends string, R> = SimpleError<E> | NotSimpleError<R>;

export function useResult<ErrorTypes extends string, ResultType>(
  initialValue: Value<ErrorTypes | BaseError, ResultType> = {
    type: 'unset'
  }
): [
  ResultAlias<ErrorTypes | BaseError, ResultType>,
  Dispatch<SetStateAction<Value<ErrorTypes | BaseError, ResultType>>>
] {
  const evaluate = (
    value: Value<ErrorTypes | BaseError, ResultType>
  ): ResultAlias<ErrorTypes | BaseError, ResultType> =>
    isSimpleError(value) ? Err(value) : Ok(value);

  const [result, setResult] = useState(evaluate(initialValue));

  return [
    result,
    value =>
      setResult(prev =>
        evaluate(typeof value === 'function' ? (value as any)(prev) : value)
      )
  ];
}

export function shouldUpdate<
  E extends string,
  R extends NotSimpleError<unknown>
>(
  result: ResultAlias<E | BaseError, R>
): result is Err<SimpleError<BaseError>, R> {
  return !result.isOk() && result.get().type === 'unset';
}

export function chainErrorSafe<E extends string>(
  result: RawResult<SimpleError<E>, unknown> | SimpleError<E>,
  current: Result<E, unknown>,
  chain: Dispatch<SimpleError<E>>
) {
  if (!shouldUpdate(current)) {
    return;
  }
  if (isResult(result)) {
    if (result.isOk()) {
      return;
    }
    chain(result.get());
  } else {
    chain(result);
  }
}
