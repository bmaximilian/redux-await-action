[redux-await-action](../README.md) › [Globals](../globals.md) › ["src/createAwaitMiddleware"](_src_createawaitmiddleware_.md)

# Module: "src/createAwaitMiddleware"

## Index

### Type aliases

* [AwaitMiddleware](_src_createawaitmiddleware_.md#awaitmiddleware)

### Functions

* [createAwaitMiddleware](_src_createawaitmiddleware_.md#const-createawaitmiddleware)

## Type aliases

###  AwaitMiddleware

Ƭ **AwaitMiddleware**: *Middleware*

## Functions

### `Const` createAwaitMiddleware

▸ **createAwaitMiddleware**(`storeAwaitEmitter`: [StoreAwaitEventEmitter](../classes/_src_storeawaiteventemitter_.storeawaiteventemitter.md)): *[AwaitMiddleware](_src_createawaitmiddleware_.md#awaitmiddleware)*

Creates the await middleware

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`storeAwaitEmitter` | [StoreAwaitEventEmitter](../classes/_src_storeawaiteventemitter_.storeawaiteventemitter.md) | The event emitter |

**Returns:** *[AwaitMiddleware](_src_createawaitmiddleware_.md#awaitmiddleware)*

- The middleware
