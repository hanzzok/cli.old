declare module 'pacote' {
  type ManifestOptions = Partial<{
    fullMetadata: boolean;
  }>;

  type Dependencies = Record<string, string>;

  type Manifest<T extends ManifestOptions> = {} & (T extends undefined
    ? {}
    : (T['fullMetadata'] extends true
        ? {
            main: string;
          }
        : {}));

  function manifest<T extends ManifestOptions>(
    spec: string,
    opts?: T
  ): Promise<Manifest<T>>;

  function extract(spec: string, destination: string): Promise<void>;
}
