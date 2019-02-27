import hasAnsi from 'has-ansi';
import { Color } from 'ink';
import React, { FC, useEffect, useState } from 'react';
import { useHotKey, useInterval, useKeyboard } from '../../hooks';

/**
 * Base code from following url:
 * https://github.com/vadimdemedes/ink-text-input/blob/master/src/index.js
 */

const EmptyCursorVisible: FC = () => {
  const [blinkVisible, setBlinkVisible] = useState(false);

  useInterval(() => setBlinkVisible(prev => !prev), 500);

  return <>{blinkVisible && <Color inverse> </Color>}</>;
};

const EmptyCursor: FC<{ visible: boolean }> = ({ visible }) => {
  return <>{visible && <EmptyCursorVisible />}</>;
};

const TextInput: FC<
  Partial<{
    focus: boolean;
    value: string;
    placeholder: string;
    showCursor: boolean;

    onChange(value: string): void;
    onSubmit(value: string): void;
  }>
> = props => {
  const {
    focus = true,
    placeholder = '',
    showCursor = true,

    onChange,
    onSubmit
  } = props;
  const [value, setValue] = useState(props.value || '');
  const [cursor, setCursor] = useState(value.length);

  const isReturnKey = useHotKey('return');

  useEffect(() => {
    if (focus && onSubmit && isReturnKey) {
      onSubmit(value);
    }
  }, [isReturnKey]);

  useHotKey('backspace', () => {
    if (cursor === 0) {
      return;
    }
    if (!focus) {
      return;
    }

    if (onChange) {
      onChange(value.slice(0, -1));
    }

    setValue(prev => prev.substring(0, cursor - 1) + prev.substring(cursor));
    setCursor(prev => prev - 1);
  });

  useHotKey('left', () => setCursor(prev => Math.max(0, prev - 1)));
  useHotKey('right', () => setCursor(prev => Math.min(prev + 1, value.length)));

  const anyKey = useKeyboard();

  useEffect(() => {
    if (hasAnsi(anyKey.info.sequence)) {
      return;
    }
    if (anyKey.info.name === 'return' || anyKey.info.name === 'backspace') {
      return;
    }
    if (!focus) {
      return;
    }
    if (
      anyKey.info.name === 'space' ||
      (anyKey.info.sequence === anyKey.chunk &&
        /^.*$/.test(anyKey.chunk) &&
        !anyKey.info.ctrl)
    ) {
      console.log(value);
      setValue(
        prev =>
          prev.substring(0, cursor) + anyKey.chunk + prev.substring(cursor)
      );
      setCursor(prev => prev + 1);

      if (onChange) {
        onChange(anyKey.chunk);
      }
    }
  }, [anyKey]);

  return (
    <>
      {value ? (
        cursor === value.length ? (
          <>
            {value}
            <EmptyCursor visible={focus && showCursor} />
          </>
        ) : (
          <>
            {cursor > 0 && value.substring(0, cursor)}
            <Color inverse>{value.substring(cursor, cursor + 1)}</Color>
            {value.length > cursor + 1 && value.substring(cursor + 1)}
          </>
        )
      ) : (
        <Color dim>
          {placeholder || <EmptyCursor visible={focus && showCursor} />}
        </Color>
      )}
    </>
  );
};

export default TextInput;
