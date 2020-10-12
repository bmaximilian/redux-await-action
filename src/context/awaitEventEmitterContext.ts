import { createContext } from 'react';
import { StoreAwaitEventEmitter } from '../StoreAwaitEventEmitter';

export const awaitEventEmitterContext = createContext<StoreAwaitEventEmitter | undefined>(undefined);

export const StoreAwaitProvider = awaitEventEmitterContext.Provider;
