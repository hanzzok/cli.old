import React, { FC } from 'react';

import { Color, ColorProps } from 'ink';

export interface LabelProps extends ColorProps {
  text: string;
  maxLength: number;
}

export const Label: FC<LabelProps> = props => {
  if (props.maxLength <= props.text.length + 2) {
    throw new Error(
      `Label max length must be bigger than ${props.text.length + 2}`
    );
  }
  return (
    <>
      {''.padStart(props.maxLength - props.text.length - 2)}
      <Color {...props}>{` ${props.text} `}</Color>{' '}
    </>
  );
};
