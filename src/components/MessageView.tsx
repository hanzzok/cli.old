import React, { FC } from 'react';

import { Box, Color, ColorProps } from 'ink';
import { Message, MessageType } from 'sezong';
import { Label } from './Label';

const colorMap = {
  [MessageType.Informal]: 'blue',
  [MessageType.Warning]: 'orange',
  [MessageType.Error]: 'crimson'
};
const labelMap: Record<MessageType, FC<ColorProps>> = {
  [MessageType.Informal]: props => (
    <Label {...props} maxLength={7} text="info" />
  ),
  [MessageType.Warning]: props => (
    <Label {...props} maxLength={7} text="warn" />
  ),
  [MessageType.Error]: props => <Label {...props} maxLength={7} text="error" />
};

export const MessageView: FC<{ sourceLines: string[]; message: Message }> = ({
  sourceLines,
  message
}) => {
  const color = colorMap[message.type];
  const line = sourceLines[message.line - 1];
  const MessageLabel = labelMap[message.type];
  return (
    <Box flexDirection="column" paddingLeft={1}>
      <Box>
        <MessageLabel bgKeyword={color} black /> {message.text}
      </Box>
      <Box>
        <Color gray>{`${message.line} | `.padStart(8)}</Color>
        {line.substring(0, message.from)}
        <Color keyword={color}>
          {line.substring(message.from, message.to)}
        </Color>
        {line.substring(message.to)}
      </Box>
      <Box paddingLeft={message.from + 8}>
        <Color keyword={color}>
          {''.padStart(message.to - message.from, '^')}
        </Color>
      </Box>
    </Box>
  );
};
