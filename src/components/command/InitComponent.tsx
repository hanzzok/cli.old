import React, { FC, useEffect, useState } from 'react';

import { Box, Color, render } from 'ink';
import { usePackageInfo } from '../../hooks';
import TextInput from '../../vendors/ink-text-input';
import { Spinner } from '../common/Spinner';

export interface Props {
  blockConstructors?: string[];
  decorators?: string[];
  platform?: string;
  force: boolean;
  strict: boolean;
}

export const InitComponent: FC<Props> = props => {
  const [platform, setPlatform] = useState(props.platform);
  const [isVerifying, setVerifying] = useState(false);
  const [isPlatformDetermined, setPlatformDetermined] = useState(false);
  const info = usePackageInfo(platform ? `sezong-platform-${platform}` : '');

  useEffect(() => {
    if (platform) {
      setVerifying(true);
    }
  }, [platform]);

  useEffect(() => {
    if (!info) {
      return;
    }
    if (!platform) {
      return;
    }
    if (!info.isOk() && info.get().type !== 'unset') {
      setVerifying(false);
    }
    if (info.isOk()) {
      setVerifying(false);
      setPlatformDetermined(true);
    }
  }, [info]);

  useEffect(() => {
    if (!isPlatformDetermined) {
      return;
    }
  }, [isPlatformDetermined]);

  return (
    <Box flexDirection="column">
      <Color bold>sezong init v0.1.0, runtime v0.4.19</Color>
      <Box flexDirection="row">
        platform to use:{' '}
        <TextInput
          value={platform || ''}
          focus={!isPlatformDetermined && !isVerifying}
          onSubmit={setPlatform}
        />
      </Box>
      {isVerifying && (
        <Box>
          <Color blue>
            <Spinner />
          </Color>{' '}
          Verifying...
        </Box>
      )}
    </Box>
  );
};

export const renderInit = (props: Props) =>
  render(
    <div>
      <InitComponent {...props} />
    </div>
  );
