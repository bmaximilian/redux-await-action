import { Action } from 'redux';

type StoreSubscriber = (action: Action) => void;

export class StoreAwaitEventEmitter {
    private subscribers: StoreSubscriber[] = [];

    /**
     * Emits an action that passes the registered subscribers
     *
     * @param action - The emitted action
     */
    public emit(action: Action): void {
        this.subscribers.forEach(subscriber => subscriber(action));
    }

    /**
     * Adds a subscriber
     *
     * @param subscriber - The subscriber to add
     * @returns - A function to remove the subscriber
     */
    public subscribe(subscriber: StoreSubscriber): () => void {
        this.subscribers.push(subscriber);

        return (): void => this.unsubscribe(subscriber);
    }

    /**
     * Removes a subscriber
     *
     * @param subscriber - The subscriber to be removed
     */
    public unsubscribe(subscriber: StoreSubscriber): void {
        this.subscribers = this.subscribers.filter(s => s !== subscriber);
    }
}
