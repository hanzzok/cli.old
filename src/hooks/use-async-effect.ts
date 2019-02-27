import { DependencyList, useEffect } from 'react';
import {
  CancelToken,
  makeCancellable,
  newCancelToken,
  PromiseCancellationError
} from '../util/promise-cancel';

interface Handler {
  onCancel?(): void;
}

export function useAsyncEffect(
  effect: (token: CancelToken) => Promise<void>,
  inputs?: DependencyList
) {
  useEffect(() => {
    const token = newCancelToken();
    const { cancel, promise } = makeCancellable(effect(token), token);
    promise.catch(error => {
      if (error instanceof PromiseCancellationError) {
        const handler = effect as Handler;
        if (handler.onCancel) {
          handler.onCancel();
        }
        return;
      } else {
        throw error;
      }
    });
    return () => cancel();
  }, inputs);
}
