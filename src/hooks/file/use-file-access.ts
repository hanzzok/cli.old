import { access as accessCallback, constants, PathLike } from 'fs';
import { promisify } from 'util';
import { useAsyncEffect, useResult } from '..';
import { BaseError, chainErrorSafe } from '../use-result';

const access = promisify(accessCallback);

export type FileAccessErrors = BaseError | 'file-access::disallowed';

export function useFileAccess(path: PathLike, mode: number = constants.R_OK) {
  const [fileAccess, setFileAccess] = useResult<FileAccessErrors, void>();

  useAsyncEffect(async () => {
    try {
      await access(path, mode);
      setFileAccess();
    } catch (e) {
      chainErrorSafe(
        {
          errorObject: e,
          message: e instanceof Error ? e.message : undefined,
          type: 'file-access::disallowed'
        },
        fileAccess,
        setFileAccess
      );
    }
  });

  return fileAccess;
}
