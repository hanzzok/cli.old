import { existsSync, PathLike } from 'fs';
import pacote from 'pacote';
import { useAsyncEffect } from '../use-async-effect';
import { BaseError, useResult } from '../use-result';
import { PackageInfoError, usePackageInfo } from './use-package-info';

export type PackageError = BaseError | 'package::cannot-download';

export function usePackage(installDirectory: PathLike, name: string) {
  const [result, setResult] = useResult<PackageInfoError, any>();
  const manifest = usePackageInfo(name, {
    fullMetadata: true
  });

  useAsyncEffect(
    async token => {
      if (!manifest.isOk()) {
        const error = manifest.get();
        if (error.type !== 'unset') {
          setResult(error);
        }
        return;
      }
      try {
        await pacote.extract(name, installDirectory.toString());
      } catch {
        setResult({
          type: 'package::cannot-download'
        });
        return;
      }
      if (existsSync(installDirectory)) {
        token.run(
          setResult,
          require(`${installDirectory}/${manifest.get().main}`)
        );
      }
    },
    [manifest]
  );

  return result;
}
