import { Dispatch } from 'react';

export class PromiseCancellationError extends Error {
  constructor() {
    super('Promise Cancelled');
    this.name = this.constructor.name;
  }
}

class CancelTokenReal implements CancelToken {
  public get isCancelled(): boolean {
    return this._isCancelled;
  }
  private _isCancelled = false;

  public run<A>(first: Dispatch<A> | (() => void), second?: A) {
    if (first.length === 0 || !second) {
      this.run_just(first as (() => void));
    } else if (second) {
      this.run_dispatch(first as Dispatch<A>, second);
    }
  }

  public revoke() {
    this._isCancelled = false;
  }

  private run_just(work: () => void) {
    if (!this.isCancelled) {
      work();
    }
  }

  private run_dispatch<A>(dispatch: Dispatch<A>, value: A) {
    if (!this.isCancelled) {
      dispatch(value);
    }
  }
}

export interface CancelToken {
  readonly isCancelled: boolean;

  run(work: () => void): void;

  run<A>(dispatch: Dispatch<A>, value: A): void;
}

export function newCancelToken(): CancelToken {
  return new CancelTokenReal();
}

export function makeCancellable<T>(
  promise: Promise<T>,
  token?: CancelToken
): { promise: Promise<T>; cancel(): void } {
  // tslint:disable-next-line:no-empty
  const cancelBase = () => {
    if (token instanceof CancelTokenReal) {
      token.revoke();
    }
  };
  let cancel = cancelBase;
  const infiniteWaiting = new Promise<T>((_resolve, reject) => {
    cancel = () => {
      cancelBase();
      reject(new PromiseCancellationError());
    };
  });
  return {
    cancel,
    promise: Promise.race([infiniteWaiting, promise])
  };
}
