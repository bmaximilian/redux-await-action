import { Action, Store } from 'redux';
import { StoreAwaitEventEmitter } from './StoreAwaitEventEmitter';

export type ActionTypes = string | string[];

export type StoreAwait<S extends Action = Action> = (s: ActionTypes, e?: ActionTypes) => Promise<S>;

/**
 * Creates the await action function
 *
 * @param store - The current redux store
 * @param eventEmitter - The event emitter that is connected to the redux store
 * @returns - A function to wait for specific actions
 */
export function createAwaitAction<
    RS = Store,
    Emitter extends StoreAwaitEventEmitter = StoreAwaitEventEmitter,
    S extends Action = Action
>(store: RS, eventEmitter: Emitter): StoreAwait<S> {
    if (!store) throw new Error('You need to access the await inside the <Provider> component of react-redux');
    if (!eventEmitter) throw new Error('You need to access the await inside the <StoreAwaitProvider> component');

    /**
     * Awaits a specific action
     *
     * @param successTypes - The action types that need to be dispatched for the promise to be resolved
     * @param errorTypes - The action types that need to be dispatched for the promise to be rejected
     * @returns - A promise that resolves when the action is dispatched to the store
     */
    return function awaitAction<S extends Action = Action>(
        successTypes: string | string[],
        errorTypes?: string | string[],
    ): Promise<S> {
        const successActionTypes = Array.isArray(successTypes) ? successTypes : [successTypes].filter(Boolean);
        const errorActionTypes = Array.isArray(errorTypes) ? errorTypes : [errorTypes].filter(Boolean);

        return new Promise((resolve, reject) => {
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
