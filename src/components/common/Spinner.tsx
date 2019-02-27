import React, { FC, useState } from 'react';
import { useInterval } from '../../hooks';

export const enum SpinnerMode {
  Iterate = 'iterate',
  Reverse = 'reverse'
}

export interface SpinnerData {
  interval: number;
  frames: string[];
  mode: SpinnerMode;
}

export const DefaultSpinners: Record<string, SpinnerData> = {
  dots: {
    frames: ['⠁', '⠂', '⠄', '⡀', '⢀', '⠠', '⠐', '⠈'],
    interval: 60,
    mode: SpinnerMode.Iterate
  }
};

export const Spinner: FC<{ data?: SpinnerData }> = ({
  data: { frames, interval, mode } = DefaultSpinners.dots
}) => {
  const [state, setState] = useState({
    index: 0,
    isReverseDirection: false
  });

  if (frames.length > 1) {
    useInterval(() => {
      setState(prev => {
        if (prev.isReverseDirection) {
          const index = Math.max(0, prev.index - 1);
          const isReverseDirection = index > 0 && mode === SpinnerMode.Reverse;
          return {
            index,
            isReverseDirection
          };
        } else if (frames.length > prev.index + 1) {
          return {
            index: prev.index + 1,
            isReverseDirection: prev.isReverseDirection
          };
        } else {
          if (mode === SpinnerMode.Iterate) {
            return {
              index: 0,
              isReverseDirection: false
            };
          } else {
            return {
              index: prev.index - 1,
              isReverseDirection: true
            };
          }
        }
      });
    }, interval);
  }

  return <>{frames[state.index]}</>;
};
