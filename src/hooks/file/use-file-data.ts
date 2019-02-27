import { constants, PathLike, readFile as readFileCallback } from 'fs';
import { promisify } from 'util';
import { useAsyncEffect } from '../use-async-effect';
import {
  BaseError,
  chainErrorSafe,
  shouldUpdate,
  useResult
} from '../use-result';
import { FileAccessErrors, useFileAccess } from './use-file-access';

const readFile = promisify(readFileCallback);

export type FileDataErrors =
  | BaseError
  | FileAccessErrors
  | 'file-data::cannot-read';

export function useFileData(path: PathLike) {
  const [fileData, setFileData] = useResult<FileDataErrors, string>();

  const access = useFileAccess(path, constants.R_OK);

  useAsyncEffect(async () => {
    if (!shouldUpdate(access)) {
      return chainErrorSafe<FileDataErrors>(access, fileData, setFileData);
    }
    try {
      setFileData(await readFile(path, 'utf8'));
    } catch (e) {
      chainErrorSafe(
        {
          errorObject: e,
          message: e instanceof Error ? e.message : undefined,
          type: 'file-data::cannot-read'
        },
        fileData,
        setFileData
      );
    }
  }, [access]);

  return fileData;
}
