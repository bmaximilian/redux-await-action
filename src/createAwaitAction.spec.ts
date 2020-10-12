import { createMock } from '@golevelup/ts-jest';
import { Store } from 'redux';
import { createAwaitAction } from './createAwaitAction';
import { StoreAwaitEventEmitter } from './StoreAwaitEventEmitter';

describe('createAwaitAction', () => {
    it('Should throw if the store is not defined', () => {
        expect(() => createAwaitAction(undefined as any, new StoreAwaitEventEmitter())).toThrow();
    });

    it('Should throw if the event emitter is not defined', () => {
        const store = createMock<Store>();
        expect(() => createAwaitAction(store, undefined as any)).toThrow();
    });
});
