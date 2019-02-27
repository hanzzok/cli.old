import React, { FC, ReactNode, useEffect, useState } from 'react';

import { Box } from 'ink';
import pacote from 'pacote';
import { Compiler } from 'sezong';
import { Platform } from 'sezong/api';
import { ConfigurationValidator } from '../config';
import { useAsyncEffect } from '../hooks/use-async-effect';
import { Label } from './Label';

import {
  BaseError,
  FileDataErrors,
  useFileData,
  useLateinitState,
  useValidation
} from '../hooks';

function determinePlatform(name: string, extracted: any): Platform<any, any> {
  const properties = Object.getOwnPropertyNames(extracted).filter(it => {
    switch (it) {
      case '__esModule':
        return false;
      default:
        return true;
    }
  });

  if (extracted instanceof Platform) {
    return extracted as Platform<any, any>;
  } else if (properties.length === 1) {
    return extracted[properties[0]] as Platform<any, any>;
  } else {
    // TODO: Make error message more expressive
    throw new Error(
      `Can't determine platform in ${name} module. Got properties: ${properties.join(
        ', '
      )}`
    );
  }
}

interface CompilerStatusMessage {
  hasError: boolean;
  message: ReactNode;
  label: string;
}

const CompilerStatusMessageComponent: FC<{
  message: CompilerStatusMessage;
}> = ({ message: { hasError, label: status, message } }) => {
  return (
    <Box flexDirection="row">
      <Label
        red={hasError}
        blue={!hasError}
        underline
        maxLength={8}
        text={status}
      />
      {message}
    </Box>
  );
};

export const CompilerComponent: FC<{
  configPath: string;
  installDirectory: string;
  onCompilerReady?(compiler: Compiler<any, any>): void;
}> = ({ configPath, installDirectory, onCompilerReady }) => {
  const [compiler, setCompiler] = useLateinitState<Compiler<any, any>>();

  const [startTime] = useState(Date.now());

  const [isOk, setOk] = useState(false);
  const [messages, setMessages] = useState<CompilerStatusMessage[]>([
    {
      hasError: false,
      label: 'info',
      message: 'Setup the compiler...'
    }
  ]);

  const addMessage = (message: CompilerStatusMessage) => {
    setMessages(prev => prev.concat([message]));
    if (message.hasError) {
      setOk(false);
    }
  };

  useEffect(() => {
    if (!isOk) {
      // todo: unmount all
      process.exit(1);
    }
  }, [messages]);

  useEffect(() => {
    if (compiler && onCompilerReady) {
      onCompilerReady(compiler);
    }
  }, [compiler]);

  const fileData = useFileData(configPath);

  useAsyncEffect(async () => {
    if (!fileData.isOk()) {
      const error = fileData.get();

      const disallowedTypes: Record<
        FileDataErrors | BaseError,
        false | string
      > = {
        'file-access::disallowed':
          'Configuration file is not available! If you have file, run sezong with more permission, or create a new `sezong.config.json` via running following command: `sezong init`',

        'file-data::cannot-read': 'Failed to read configuration file!',

        unset: false
      };

      const result = disallowedTypes[error.type];
      if (result) {
        addMessage({
          hasError: true,
          label: 'error',
          message: result
        });
      }
      return;
    }
  }, [fileData]);

  const [data, setData] = useLateinitState<any>();

  useAsyncEffect(async () => {
    if (!fileData.isOk()) {
      return;
    }
    try {
      setData(JSON.parse(fileData.get()));
    } catch {
      addMessage({
        hasError: true,
        label: 'error',
        message: 'Configuration file is not a valid json file!'
      });
      return;
    }
  }, [fileData]);

  const validateResult = useValidation(ConfigurationValidator, data);

  useAsyncEffect(async () => {
    if (!validateResult.isOk()) {
      addMessage({
        hasError: true,
        label: 'error',
        message: 'Configuration file is not a valid sezong configuration file!'
      });
      return;
    }

    const moduleName = `sezong-platform-${validateResult.get().platform}`;
    // TODO: Create a lock file which determines should the program requires to download package
    let main: string;
    try {
      main = (await pacote.manifest(moduleName, {
        fullMetadata: true
      })).main;
      await pacote.extract(
        moduleName,
        `${installDirectory}/platform/${validateResult.get().platform}`
      );
    } catch {
      addMessage({
        hasError: true,
        label: 'error',
        message: `Failed to download module '${moduleName}'. Maybe you misspelt.`
      });
      return;
    }

    let platform: Platform<any, any>;
    try {
      platform = determinePlatform(
        moduleName,
        require(`${installDirectory}/platform/${
          validateResult.get().platform
        }/${main}`)
      );
    } catch {
      addMessage({
        hasError: true,
        label: 'error',
        message: `Failed to determine the platform`
      });
      return;
    }

    setCompiler(new Compiler(platform));
    addMessage({
      hasError: false,
      label: 'info',
      message: `Completed to intialize the compiler. (${(Date.now() -
        startTime) /
        1000} seconds used)`
    });
  }, [validateResult]);

  return (
    <Box flexDirection="column">
      {messages
        .filter(it => it)
        .map((value, index) => (
          <CompilerStatusMessageComponent key={index} message={value} />
        ))}
    </Box>
  );
};
