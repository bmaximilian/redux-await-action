import { Action } from 'redux';
import { useContext } from 'react';
import { useStore } from 'react-redux';
import { AwaitEventEmitterContext } from './context/awaitEventEmitterContext';
import { ActionTypes, createAwaitAction } from './createAwaitAction';

/**
 * Creates the await action function
 *
 * @returns - A function to wait for specific actions
 */
export function useAwaitAction<S extends Action = Action>(): (s: ActionTypes, e?: ActionTypes) => Promise<S> {
    const store = useStore();
    const eventEmitter = useContext(AwaitEventEmitterContext);

    if (!eventEmitter) throw new Error('You need to access the await inside the <StoreAwaitProvider> component');

    return createAwaitAction(store, eventEmitter);
}
