import { SIGINT } from 'constants';
import { StdinContext } from 'ink';
import { useContext, useEffect, useState } from 'react';
import { emitKeypressEvents, Key } from 'readline';

export interface KeyState {
  chunk: string;
  info: Key;
  pressed: boolean;
}

emitKeypressEvents(process.stdin);

if (process.stdin.isTTY && process.stdin.setRawMode) {
  process.stdin.setRawMode(true);
  process.stdin.on('keypress', (_chunk: string, receivedKey: Key) => {
    if (receivedKey.ctrl && receivedKey.name === 'c') {
      process.exit(SIGINT);
    }
  });
}

export function useKeyboard(key?: string) {
  const [pressed, setPressed] = useState({
    chunk: '',
    info: {},
    pressed: false
  } as KeyState);

  const { stdin } = useContext(StdinContext);

  useEffect(() => {
    const handler = (chunk: string, receivedKey: Key) => {
      setPressed({
        chunk,
        info: receivedKey,
        pressed: !key || key === receivedKey.name
      } as KeyState);
    };

    stdin.on('keypress', handler);

    return () => {
      stdin.removeListener('keypress', handler);
    };
  }, []);

  return pressed;
}

function useHotKey__key(key: string) {
  const [pressCount, setPressCount] = useState(0);
  const [pressed, setPressed] = useState<number | false>(false);
  const keyboard = useKeyboard(key);

  useEffect(() => {
    if (keyboard.pressed) {
      setPressCount(prev => prev + 1);
    } else {
      setPressed(false);
    }
  }, [keyboard]);

  useEffect(() => {
    setPressed(pressCount);
  }, [pressCount]);

  return pressed;
}

function useHotKey__key_callback(key: string, callback: () => void) {
  const pressed = useHotKey__key(key);

  useEffect(() => {
    if (pressed) {
      callback();
    }
  }, [pressed]);
}

export function useHotKey(key: string, callback?: undefined): number | false;

export function useHotKey(key: string, callback: () => void): void;

export function useHotKey(
  key: string,
  callback?: () => void
): number | false | void {
  if (!callback) {
    return useHotKey__key(key);
  } else {
    useHotKey__key_callback(key, callback);
  }
}
