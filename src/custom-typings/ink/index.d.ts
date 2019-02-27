declare module 'ink' {
  import { Chalk } from 'chalk';
  import { ReadStream, WriteStream } from 'fs';
  import { Component, Context, ReactElement, ReactNode } from 'react';

  export type UnmountFunction = () => void;

  export function render(
    tree: ReactElement,
    options?: {
      stdin?: NodeJS.ReadStream;
      stdout?: NodeJS.WriteStream;
      debug?: boolean;
    }
  ): UnmountFunction;

  export function renderToString(tree: ReactNode): string;

  type Margin =
    | {
        margin: number;
      }
    | {
        marginX: number;
        marginY: number;
      }
    | {
        marginTop: number;
        marginBottom: number;
        marginLeft: number;
        marginRight: number;
      };

  interface Padding {
    paddingTop: number;
    paddingBottom: number;
    paddingLeft: number;
    paddingRight: number;
  }

  interface Size {
    width: number;
    height: number;
  }

  interface Flex {
    flexGrow: number;
    flexShrink: number;
    flexDirection: 'row' | 'row-reverse' | 'column' | 'column-reverse';
    alignItems: 'flex-start' | 'center' | 'flex-end';
    justifyContent:
      | 'flex-start'
      | 'center'
      | 'flex-end'
      | 'space-between'
      | 'space-around';
  }

  export class Box extends Component<
    Partial<
      Margin &
        Padding &
        Size &
        Flex & {
          // ? children -> children
          unstable__transformChildren(children: any): any;
        }
    > & {
      children: ReactNode;
    },
    {}
  > {}

  type ForegroundColors = 'hex' | 'hsl' | 'hsv' | 'hwv' | 'rgb';
  type BackgroundColors = 'bgHex' | 'bgHsl' | 'bgHsv' | 'bgHwv' | 'bgRgb';

  export type ChalkColors = {
    [K in keyof Chalk]: Chalk[K] extends Chalk ? K : never
  }[keyof Chalk];

  export type ColorProps = Partial<
    Record<ForegroundColors, string> &
      Record<BackgroundColors, string> &
      Record<ChalkColors, boolean> & {
        keyword: string;
        bgKeyword: string;
      }
  >;

  export class Color extends Component<
    ColorProps & {
      children: ReactNode;
    },
    {}
  > {}

  export class Text extends Component<
    Partial<{
      bold: boolean;
      italic: boolean;
      underline: boolean;
      strikethrough: boolean;
    }> & {
      children: ReactNode;
    },
    {}
  > {}

  export const StdinContext: Context<{
    stdin: NodeJS.ReadStream;
    setRawMode?(mode: boolean): void;
  }>;

  export const StdoutContext: Context<{
    stdout: NodeJS.WriteStream;
  }>;
}
