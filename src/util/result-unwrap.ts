import { Result } from 'space-lift';

export function unwrap<T>(result: Result<unknown, T>, safe?: false): T;
export function unwrap<T>(result: Result<unknown, T>, safe: true): T | null;

export function unwrap<T>(result: Result<unknown, T>, safe = false): T | null {
  if (result.isOk()) {
    return result.get();
  } else {
    if (safe) {
      return null;
    } else {
      throw result.get();
    }
  }
}
