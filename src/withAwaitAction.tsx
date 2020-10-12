import React, {
    ComponentType,
    forwardRef,
    ForwardRefExoticComponent,
    ForwardRefRenderFunction,
    PropsWithoutRef,
    RefAttributes,
} from 'react';
import { Action } from 'redux';
import { ReactReduxContext } from 'react-redux';
import { AwaitEventEmitterContext } from './context/awaitEventEmitterContext';
import { createAwaitAction, StoreAwait } from './createAwaitAction';

export interface WithAwaitAction<S extends Action = Action> {
    storeAwait: StoreAwait<S>;
}

/**
 * Creates a hoc that attaches the storeAwait method to the wrapped component
 *
 * @param WrappedComponent - The wrapped component
 * @returns - The enhanced component with storeAwait prop
 */
export function withAwaitAction<P = any>(
    WrappedComponent: ComponentType<P & WithAwaitAction>,
): ForwardRefExoticComponent<PropsWithoutRef<P> & RefAttributes<unknown>> {
    const componentName = WrappedComponent.displayName || WrappedComponent.name || 'Component';

    /**
     * Render function for the forward ref component
     *
     * @param props - The component props
     * @param ref - The component ref (if existing)
     * @returns - The rendered component
     */
    const hoc: ForwardRefRenderFunction<unknown, P> = (props: P, ref) => (
        <AwaitEventEmitterContext.Consumer>
            {(emitter): JSX.Element => (
                <ReactReduxContext.Consumer>
                    {({ store }): JSX.Element => {
                        if (!emitter) {
                            throw new Error('You need to access the await inside the <StoreAwaitProvider> component');
                        }
                        const storeAwait = createAwaitAction(store, emitter);

                        return <WrappedComponent {...props} storeAwait={storeAwait} ref={ref} />;
                    }}
                </ReactReduxContext.Consumer>
            )}
        </AwaitEventEmitterContext.Consumer>
    );

    const forwardedHoc = forwardRef(hoc);

    hoc.displayName = `withAwaitAction(${componentName})`;
    forwardedHoc.displayName = `withAwaitAction(${componentName})`;

    return forwardedHoc;
}
