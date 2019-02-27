import React, { FC, useEffect } from 'react';

import { Box } from 'ink';
import { Compiler } from 'sezong';
import { useLateinitState } from '../hooks';
import { CompilerComponent } from './Compiler';

export const App: FC = () => {
  const [compiler, setCompiler] = useLateinitState<Compiler<any, any>>();

  useEffect(() => {
    if (compiler) {
      // unmount();
    }
  }, [compiler]);

  return (
    <Box flexDirection="column">
      <CompilerComponent
        configPath={`${process.cwd()}/sezong.config.json`}
        installDirectory={`${process.cwd()}/sezong_modules`}
        onCompilerReady={setCompiler}
      />
    </Box>
  );
};
