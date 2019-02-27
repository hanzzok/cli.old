import React from 'react';

import { render } from 'ink';
import { InitComponent } from './components/command/InitComponent';

export const unmount = render(<InitComponent force={false} strict={false} />);
