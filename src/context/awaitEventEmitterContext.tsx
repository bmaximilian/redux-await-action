import React, { createContext } from 'react';
import { StoreAwaitEventEmitter } from '../StoreAwaitEventEmitter';

export const AwaitEventEmitterContext = createContext<StoreAwaitEventEmitter | undefined>(undefined);

interface StoreAwaitProviderProps {
    emitter: StoreAwaitEventEmitter;
}

/**
 * The provider for the event emitter
 *
 * @param props - The provider props
 * @returns - The rendered component
 */
export const StoreAwaitProvider: React.FC<StoreAwaitProviderProps> = props => (
    <AwaitEventEmitterContext.Provider value={props.emitter}>{props.children}</AwaitEventEmitterContext.Provider>
);
