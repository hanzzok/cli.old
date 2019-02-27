import React, { FC, ReactNode } from 'react';

import { renderToString } from 'ink';
import terminalLink from 'terminal-link';

const Link: FC<{ url?: string; children: ReactNode }> = ({
  url = '',
  children
}) => {
  const text = renderToString(<span>{children}</span>);
  return <span>{terminalLink(text, url)}</span>;
};

export default Link;
