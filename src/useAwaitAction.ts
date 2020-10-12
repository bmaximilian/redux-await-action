import { Action } from 'redux';
import { useContext } from 'react';
import { useStore } from 'react-redux';
import { awaitEventEmitterContext } from './context/awaitEventEmitterContext';

export type ActionTypes = string | string[];

/**
 * Creates the await action function
 *
 * @returns - A function to wait for specific actions
 */
export function useAwaitAction<S extends Action = Action>(): (s: ActionTypes, e: ActionTypes) => Promise<S> {
    const store = useStore();
    const eventEmitter = useContext(awaitEventEmitterContext);

    if (!eventEmitter) throw new Error('You need to call the hook inside the <StoreAwaitProvider> component');

    /**
     * Awaits a specific action
     *
     * @param successTypes - The action types that need to be dispatched for the promise to be resolved
     * @param errorTypes - The action types that need to be dispatched for the promise to be rejected
     * @returns - A promise that resolves when the action is dispatched to the store
     */
    return function awaitAction<S extends Action = Action>(
        successTypes: string | string[],
        errorTypes: string | string[],
    ): Promise<S> {
        const successActionTypes = Array.isArray(successTypes) ? successTypes : [successTypes];
        const errorActionTypes = Array.isArray(errorTypes) ? errorTypes : [errorTypes];

        return new Promise((resolve, reject) => {
            if (!store) {
                reject(new Error('Store not found. You need to be inside a react component.'));
                return;
            }

            /**
             * Subscribes to the store events and resolves or rejects the promise
             *
             * @param action - The dispatched actions
             */
            const subscriber = (action: Action): void => {
                if (successActionTypes.findIndex(type => type === action.type) > -1) {
                    resolve(action as S);
                    eventEmitter.unsubscribe(subscriber);
                    return;
                }

                if (errorActionTypes.findIndex(type => type === action.type) > -1) {
                    reject(action);
                    eventEmitter.unsubscribe(subscriber);
                }
            };

            eventEmitter.subscribe(subscriber);
        });
    };
}
