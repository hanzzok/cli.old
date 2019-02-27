import { useEffect } from 'react';
import { useResult } from '../use-result';

export type JsonErrors = 'json::parse-fail';

export function useJson(data: string): any {
  const [json, setJson] = useResult<JsonErrors, any>();

  useEffect(() => {
    try {
      setJson(JSON.parse(data));
    } catch /*(e)*/ {
      setJson({
        // errorObject: e,
        // message: e instanceof Error ? e.mssage : undefined,
        type: 'json::parse-fail'
      });
    }
  }, []);

  return json;
}
