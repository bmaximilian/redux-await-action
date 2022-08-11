import { useMemo, useContext } from 'react';
import { Action } from 'redux';
import { useStore } from 'react-redux';
import { AwaitEventEmitterContext } from './context/awaitEventEmitterContext';
import { ActionTypes, createAwaitAction } from './createAwaitAction';

/**
 * Creates the await action function
 *
 * @returns - A function to wait for specific actions
 */
export function useAwaitAction<S extends Action = Action>(): (s: ActionTypes, e?: ActionTypes) => Promise<S> {
    const store = useStore<any, S>();
    const eventEmitter = useContext(AwaitEventEmitterContext);

    if (!eventEmitter) throw new Error('You need to access the await inside the <StoreAwaitProvider> component');

    const awaitAction: (s: ActionTypes, e?: ActionTypes | undefined) => Promise<S> = useMemo(
        () => createAwaitAction(store, eventEmitter),
        [store, eventEmitter],
    );

    return awaitAction;
}
