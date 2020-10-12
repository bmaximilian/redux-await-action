import { StoreAwaitEventEmitter } from './StoreAwaitEventEmitter';

describe('StoreAwaitEventEmitter', () => {
    let emitter: StoreAwaitEventEmitter;

    beforeEach(() => {
        emitter = new StoreAwaitEventEmitter();
    });

    it('Should subscribe to an event', () => {
        const subscriber = jest.fn();

        const unsub = emitter.subscribe(subscriber);

        expect((emitter as any).subscribers).toHaveLength(1);
        expect((emitter as any).subscribers).toContain(subscriber);

        emitter.emit({ type: 'FOO' });

        expect(subscriber).toHaveBeenCalledWith({ type: 'FOO' });
        expect(subscriber).toHaveBeenCalledTimes(1);

        unsub();
        expect((emitter as any).subscribers).toHaveLength(0);
        expect((emitter as any).subscribers).not.toContain(subscriber);

        emitter.emit({ type: 'FOO' });
        expect(subscriber).toHaveBeenCalledTimes(1);
    });
});
