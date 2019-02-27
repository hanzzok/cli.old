import { PathLike } from 'fs';
import { useEffect, useState } from 'react';
import { FileDataErrors, useFileData } from '../file/use-file-data';
import { chainErrorSafe, useResult } from '../use-result';
import { JsonErrors, useJson } from './use-json';

export function useJsonFile(path: PathLike) {
  const [result, setResult] = useResult<JsonErrors | FileDataErrors, any>();
  const fileData = useFileData(path);
  const [realFileData, setRealFileData] = useState<string | null>(null);
  const json = useJson(realFileData || '');

  useEffect(() => {
    if (!fileData.isOk()) {
      return chainErrorSafe(fileData, result, setResult);
    }
    setRealFileData(fileData.get());
  }, [fileData]);

  useEffect(() => {
    if (!json || !realFileData) {
      return;
    }
    if (!json.isOk()) {
      return chainErrorSafe(json, result, setResult);
    }
    setResult(json);
  }, [json]);

  return result;
}
