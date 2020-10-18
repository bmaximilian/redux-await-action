# Await Redux Actions
> A redux extension to wait for actions in react components
> Requires the installation of react (>= 16.3) and redux (>= 4)

If using redux, sometimes there is a need to wait with specific logic until an action is dispatched.
This is especially needed when decoupling ajax requests from react components with redux-observable or redux-thunk into asynchronous actions.

## Installation
```
npm i --save redux-await-action
```

## Usage

### Setting up the middleware
You need to create an instance of the event emitter and apply the middleware to your redux store.
```typescript
import { createAwaitMiddleware, StoreAwaitEventEmitter } from 'redux-await-action';

const awaitEmitter = new StoreAwaitEventEmitter();
const storeAwaitMiddleware = createAwaitMiddleware(awaitEmitter);

const store = createReduxStore(
  rootReducer,
  applyMiddleware(storeAwaitMiddleware)
);
```

### Register the Provider
To be able to wait for actions inside the react components, you need to add the StoreAwaitProvider in your JSX.
It should be placed somewhere near your redux store provider.
```jsx
import { Provider } from 'redux';
import { StoreAwaitProvider } from 'redux-await-action';

return (
    <Provider store={store}>
        <StoreAwaitProvider emitter={awaitEmitter}>
            {props.children}
        </StoreAwaitProvider>
    </Provider>
);
```

### Wait for actions somewhere in your react components using the `useAwaitAction()` hook
```tsx
import React from 'react';
import { connect, DispatchProp } from 'redux';
import { useAwaitAction } from 'redux-await-action';

export const myCoponent = connect()((props: DispatchProp) => {
    const awaitAction = useAwaitAction();

    const handleLoadData = () => {
        /**
         * This statement creates a promise that resolves when an action with type 'LOAD_DATA_SUCCEEDED' is dispatched.
         * If 'LOAD_DATA_FAILED' is dispatched earlier, the promise will reject
         */
        awaitAction('LOAD_DATA_SUCCEEDED', 'LOAD_DATA_FAILED').then(() => {
            window.location.href = 'https://example.org/data-loaded';
        });
        
        // This dispatches a redux action (is redux functionality).
        // The action should be async (using something like redux-observable) and dispatch 'LOAD_DATA_SUCCEEDED' when the data is successfully loaded.
        dispatch({ type: 'LOAD_DATA_START' });
    };
    
    return (
        <button onClick={handleLoadData}>
            Click Me!
        </button>
    );
});
```

### Wait for actions somewhere in your react components using the `withAwaitAction()` HOC
Class based components can't use React hooks. So there needs to be an other way to inject the `awaitAction` method.
```tsx
import React, { Component } from 'react';
import { connect, DispatchProp } from 'redux';
import { withAwaitAction, WithAwaitAction } from 'redux-await-action';

class MyCoponent extends Component<DispatchProp & WithAwaitAction> {
    private handleLoadData = () => {
        /**
         * This statement creates a promise that resolves when an action with type 'LOAD_DATA_SUCCEEDED' is dispatched.
         * If 'LOAD_DATA_FAILED' is dispatched earlier, the promise will reject
         */
        props.storeAwait('LOAD_DATA_SUCCEEDED', 'LOAD_DATA_FAILED').then(() => {
            window.location.href = 'https://example.org/data-loaded';
        });
        
        // This dispatches a redux action (is redux functionality).
        // The action should be async (using something like redux-observable) and dispatch 'LOAD_DATA_SUCCEEDED' when the data is successfully loaded.
        dispatch({ type: 'LOAD_DATA_START' });
    };
    
    public render() {
        return (
            <button onClick={handleLoadData}>
                Click Me!
            </button>
        );
    }
}

export default withAwaitAction(connect()(MyComponent));
```

## The await method
The await method that is created from the hook or passed from the HOC takes 1 - 2 arguments.
The first argument is the type of the action that needs to be dispatched in the happy case - so when the returne promise should resolve.
The second argument ts the type of the action that needs to be dispatched when the returned promise should reject.
Both arguments can either be a string (one action type) or an array containing multiple action types.
If one of the arguments is an array, the promise will resolve or reject at the first action that contains one of the passed types.
The method returns a promise.
The returned promise will be **resolved when one of the action types of the first parameter is dispatched**. The promise resolves whith the dispatched action.
So the dispatched action that made the promise resolve is passed to the `then` callback.
The returned promise will be **rejected when one of the action types of the second parameter is dispatched**. The promise rejects the dispatched action.
So the dispatched action that made the promise reject is passed to the `catch` callback.

## Useful links
- [API docs](docs/generated/globals.md)


