import { createContext } from 'react';
import { StoreAwaitEventEmitter } from '../StoreAwaitEventEmitter';

export const AwaitEventEmitterContext = createContext<StoreAwaitEventEmitter | undefined>(undefined);

export const StoreAwaitProvider = AwaitEventEmitterContext.Provider;
