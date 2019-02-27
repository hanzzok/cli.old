import { createContext } from 'react';
import { LockFile } from '../hooks';

export const LockFileContext = createContext<LockFile>({} as LockFile);
