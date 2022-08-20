import React, { useEffect, useState } from 'react';
import { connect, DispatchProp, Provider } from 'react-redux';
import { act } from 'react-dom/test-utils';
import { render } from '@testing-library/react';
import { applyMiddleware, combineReducers, compose, createStore, Dispatch, Store } from 'redux';
import { StoreAwaitProvider } from './context/awaitEventEmitterContext';
import { StoreAwaitEventEmitter } from './StoreAwaitEventEmitter';
import { createAwaitMiddleware } from './createAwaitMiddleware';
import { useAwaitAction } from './useAwaitAction';
import { StoreAwait } from './createAwaitAction';

const testReducer = jest.fn((store = {}) => store);
const rootReducer = combineReducers({
    test: testReducer,
});

describe('useAwaitAction', () => {
    let eventEmitter: StoreAwaitEventEmitter;
    let store: Store;

    beforeEach(() => {
        eventEmitter = new StoreAwaitEventEmitter();
        store = createStore(rootReducer, {}, compose(applyMiddleware(createAwaitMiddleware(eventEmitter))));
    });

    /**
     * Creates the test components with store
     *
     * @param awaiter - The function that calls store await
     * @param dispatcher - The function that dispatches an action
     * @returns - The app component
     */
    const createStoreAwaitComponents = (
        awaiter: (a: StoreAwait) => void,
        dispatcher: (d: Dispatch) => void,
    ): JSX.Element => {
        const TestComponent = connect()((props: DispatchProp): null => {
            const storeAwait = useAwaitAction();

            useEffect(() => {
                awaiter(storeAwait);
                dispatcher(props.dispatch);
            });

            return null;
        });

        const fullComponent = (
            <Provider store={store}>
                <StoreAwaitProvider emitter={eventEmitter}>
                    <TestComponent />
                </StoreAwaitProvider>
            </Provider>
        );

        return fullComponent;
    };

    it('Should resolve with the action when a success action is bound', async () => {
        await new Promise(resolve => {
            const awaiter = jest.fn((storeAwait: StoreAwait) => {
                // eslint-disable-next-line jest/valid-expect-in-promise
                storeAwait('MY_SUCCESS_ACTION', 'MY_ERROR_ACTION')
                    .then(a => {
                        expect(a.type).toEqual('MY_SUCCESS_ACTION');
                        expect(awaiter).toHaveBeenCalled();
                        resolve();
                    })
                    .catch(() => expect.fail('This should not be called'));
            });

            act(() => {
                render(
                    createStoreAwaitComponents(awaiter, dispatch => {
                        dispatch({ type: 'MY_SUCCESS_ACTION' });
                    }),
                );
            });
        });
    });

    it('Should resolve with the success action when one of the success actions is dispatched', async () => {
        await new Promise(resolve => {
            const awaiter = jest.fn((storeAwait: StoreAwait) => {
                // eslint-disable-next-line jest/valid-expect-in-promise
                storeAwait(['MY_SUCCESS_ACTION_1', 'MY_SUCCESS_ACTION_2'], 'MY_ERROR_ACTION')
                    .then(a => {
                        expect(a.type).toEqual('MY_SUCCESS_ACTION_2');
                        expect(awaiter).toHaveBeenCalled();
                        resolve();
                    })
                    .catch(() => expect.fail('This should not be called'));
            });

            act(() => {
                render(
                    createStoreAwaitComponents(awaiter, dispatch => {
                        dispatch({ type: 'MY_SUCCESS_ACTION_2' });
                    }),
                );
            });
        });
    });

    it('Should reject with the error action when the error action is triggered earlier', async () => {
        await new Promise((resolve, reject) => {
            const awaiter = jest.fn(async (storeAwait: StoreAwait) => {
                // eslint-disable-next-line jest/valid-expect-in-promise
                await storeAwait('MY_SUCCESS_ACTION', 'MY_ERROR_ACTION')
                    .then(() => {
                        expect.fail('This should not be called');
                        reject();
                    })
                    .catch(a => {
                        expect(a.type).toEqual('MY_ERROR_ACTION');
                        expect(awaiter).toHaveBeenCalled();
                        resolve();
                    });
            });

            act(() => {
                render(
                    createStoreAwaitComponents(awaiter, dispatch => {
                        dispatch({ type: 'MY_ERROR_ACTION' });
                        dispatch({ type: 'MY_SUCCESS_ACTION' });
                    }),
                );
            });
        });
    });

    it('Should reject with the error action when one of the error actions is triggered earlier', async () => {
        await new Promise((resolve, reject) => {
            const awaiter = jest.fn(async (storeAwait: StoreAwait) => {
                // eslint-disable-next-line jest/valid-expect-in-promise
                await storeAwait('MY_SUCCESS_ACTION', ['MY_ERROR_ACTION_1', 'MY_ERROR_ACTION_2'])
                    .then(() => {
                        expect.fail('This should not be called');
                        reject();
                    })
                    .catch(a => {
                        expect(a.type).toEqual('MY_ERROR_ACTION_2');
                        expect(awaiter).toHaveBeenCalled();
                        resolve();
                    });
            });

            act(() => {
                render(
                    createStoreAwaitComponents(awaiter, dispatch => {
                        dispatch({ type: 'MY_ERROR_ACTION_2' });
                        dispatch({ type: 'MY_SUCCESS_ACTION' });
                    }),
                );
            });
        });
    });

    it('Should do nothing when a not registered action is dispatched', async () => {
        await new Promise((resolve, reject) => {
            const awaiter = jest.fn(async (storeAwait: StoreAwait) => {
                // eslint-disable-next-line jest/valid-expect-in-promise
                await storeAwait('MY_SUCCESS_ACTION', ['MY_ERROR_ACTION_1', 'MY_ERROR_ACTION_2'])
                    .then(() => {
                        expect.fail('This should not be called');
                        reject();
                    })
                    .catch(() => {
                        expect.fail('This should not be called');
                        reject();
                    });
            });

            eventEmitter.subscribe(action => {
                if (action.type === 'SOME_OTHER_ACTION2') resolve();
            });

            act(() => {
                render(
                    createStoreAwaitComponents(awaiter, dispatch => {
                        dispatch({ type: 'SOME_OTHER_ACTION' });
                        dispatch({ type: 'SOME_OTHER_ACTION2' });
                    }),
                );
            });
        });
    });

    it('Should throw then the eventEmitter is not defined', async () => {
        // Disable error messages on the console for this test
        const errorHandler = console.error; // eslint-disable-line no-console
        console.error = jest.fn(); // eslint-disable-line no-console

        /**
         * Test component
         *
         * @returns - The component
         */
        const TestComponent = (): null => {
            const awaitAction = useAwaitAction();
            awaitAction('TEST');

            return null;
        };

        expect(() => {
            render(
                <Provider store={store}>
                    <TestComponent />
                </Provider>,
            );
        }).toThrow('You need to access the await inside the <StoreAwaitProvider> component');

        console.error = errorHandler; // eslint-disable-line no-console
    });

    it('Should not re-initialize when storeAwait when component re-renders', async () => {
        const renderCounter = jest.fn();
        /**
         * -
         * @returns TestComponent
         */
        const TestComponent = (): any => {
            const storeAwait = useAwaitAction();
            const [, triggerRender] = useState<null>();

            useEffect(() => {
                triggerRender(null);
            });

            useEffect(() => {
                renderCounter();
            }, [storeAwait]);

            return null;
        };

        act(() => {
            render(
                <Provider store={store}>
                    <StoreAwaitProvider emitter={eventEmitter}>
                        <TestComponent />
                    </StoreAwaitProvider>
                </Provider>,
            );
        });
        expect(renderCounter).toHaveBeenCalledTimes(1);
    });
});
