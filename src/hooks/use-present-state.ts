import { Dispatch, SetStateAction, useState } from 'react';

export function useLateinitState<T>(): [T, Dispatch<SetStateAction<T>>] {
  return usePresentState<T>(null);
}

export function usePresentState<T>(
  initialValue: T | null
): [T, Dispatch<SetStateAction<T>>] {
  const [real, setReal] = useState<T | null>(initialValue || null);

  return [real as T, setReal as Dispatch<SetStateAction<T>>];
}
