import pacote, { Manifest, ManifestOptions } from 'pacote';
import { NotSimpleError } from '../../util/result';
import { useAsyncEffect } from '../use-async-effect';
import { useResult } from '../use-result';

export type PackageInfoError = 'package-info::no-manifest';

export function usePackageInfo<T extends ManifestOptions>(
  name: string,
  option?: T
) {
  const [result, setResult] = useResult<PackageInfoError, Manifest<T>>();

  useAsyncEffect(async token => {
    try {
      const manifest = await pacote.manifest(name, option);
      token.run(setResult, manifest as NotSimpleError<Manifest<T>>);
    } catch {
      setResult({
        type: 'package-info::no-manifest'
      });
    }
  }, []);

  return result;
}
