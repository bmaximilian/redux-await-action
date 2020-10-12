import { Middleware } from 'redux';
import { StoreAwaitEventEmitter } from './StoreAwaitEventEmitter';

type AwaitMiddleware = Middleware;

/**
 * Creates the await middleware
 *
 * @param storeAwaitEmitter - The event emitter
 * @returns - The middleware
 */
export const createAwaitMiddleware = (storeAwaitEmitter: StoreAwaitEventEmitter): AwaitMiddleware => () => next => (
    action,
): any => {
    const result = next(action);
    storeAwaitEmitter.emit(action);
    return result;
};
