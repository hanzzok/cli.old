import { useEffect, useState } from 'react';
import { object, string } from 'validation.ts';
import { SimpleError } from '../../util/result';
import { JsonErrors } from '../json/use-json';
import { useJsonFile } from '../json/use-json-file';
import { BaseError } from '../use-result';

export const LockEntryValidator = object({
  name: string,
  version: string
});

export type LockEntry = typeof LockEntryValidator.T;

export interface LockFileData {
  [name: string]: LockEntry;
}

export type NotEmpty<T> = (keyof T)['toString']['length'] extends 0 ? never : T;

export type PatchModifier = NotEmpty<
  Partial<{
    name: string;
    version: string;
  }>
>;

export interface PatchRequest {
  type: 'patch';
  target: string;
  modify: PatchModifier;
}

export interface AddRequest {
  type: 'add';
  target: string;
  name: string;
  version: string;
}

export type Request = PatchRequest | AddRequest;

export type LockFileError = BaseError | JsonErrors | 'lock-file::invalid-entry';

export type LockFileAdd = (
  target: string,
  name: string,
  version: string
) => void;

export type LockFilePatch = (target: string, modify: PatchModifier) => void;

export interface LockFile {
  readonly data: LockFileData;
  readonly errors: Array<SimpleError<LockFileError>>;

  readonly add: LockFileAdd;
  readonly patch: LockFilePatch;
}

export function useLockFile(): LockFile {
  const file = useJsonFile(process.cwd() + '/sezong-lock.json');
  const [data, setData] = useState<LockFileData>({});
  const [isLoaded, setLoaded] = useState(false);
  const [requests, setRequests] = useState<Request[]>([]);
  const [entryErrors, setEntryErrors] = useState<
    Array<SimpleError<LockFileError>>
  >([]);

  const patch: LockFilePatch = (target, modify) => {
    setRequests(prev =>
      prev.concat([
        {
          modify,
          target,
          type: 'patch'
        }
      ])
    );
  };

  const add: LockFileAdd = (target, name, version) => {
    setRequests(prev =>
      prev.concat([
        {
          name,
          target,
          type: 'add',
          version
        }
      ])
    );
  };

  useEffect(() => {
    if (!isLoaded) {
      return;
    }
    if (requests.length === 0) {
      return;
    }

    for (const request of requests) {
      switch (request.type) {
        case 'add':
          setData(prev => ({
            ...{
              [request.target]: {
                name: request.name,
                version: request.version
              }
            },
            ...prev
          }));
          break;
        case 'patch':
          setData(prev => ({
            ...{
              [request.target]: {
                name: request.modify.name || prev[request.target].name,
                version: request.modify.version || prev[request.target].version
              }
            },
            ...prev
          }));
      }
    }
  }, [requests, isLoaded]);

  useEffect(() => {
    if (!file.isOk()) {
      const error = file.get();
      if (error.type !== 'unset') {
        setData({});
        setEntryErrors(prev =>
          prev.concat([error as SimpleError<LockFileError>])
        );
        setLoaded(true);
      }
      return;
    }

    const o = file.get();

    for (const key of Object.keys(o)) {
      const result = LockEntryValidator.validate(o[key]);
      if (result.isOk()) {
        setData(prev => ({
          ...{ [key]: result.get() },
          ...prev
        }));
      } else {
        setEntryErrors(prev =>
          prev.concat([
            {
              // errorObject: result.get(),
              type: 'lock-file::invalid-entry'
            }
          ])
        );
      }
    }
  }, [file]);

  return {
    data,
    errors: entryErrors,

    add,
    patch
  };
}
