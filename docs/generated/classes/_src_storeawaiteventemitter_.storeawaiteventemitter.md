[redux-await-action](../README.md) › [Globals](../globals.md) › ["src/StoreAwaitEventEmitter"](../modules/_src_storeawaiteventemitter_.md) › [StoreAwaitEventEmitter](_src_storeawaiteventemitter_.storeawaiteventemitter.md)

# Class: StoreAwaitEventEmitter

## Hierarchy

* **StoreAwaitEventEmitter**

## Index

### Methods

* [emit](_src_storeawaiteventemitter_.storeawaiteventemitter.md#emit)
* [subscribe](_src_storeawaiteventemitter_.storeawaiteventemitter.md#subscribe)
* [unsubscribe](_src_storeawaiteventemitter_.storeawaiteventemitter.md#unsubscribe)

## Methods

###  emit

▸ **emit**(`action`: Action): *void*

Emits an action that passes the registered subscribers

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`action` | Action | The emitted action  |

**Returns:** *void*

___

###  subscribe

▸ **subscribe**(`subscriber`: [StoreSubscriber](../modules/_src_storeawaiteventemitter_.md#storesubscriber)): *function*

Adds a subscriber

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`subscriber` | [StoreSubscriber](../modules/_src_storeawaiteventemitter_.md#storesubscriber) | The subscriber to add |

**Returns:** *function*

- A function to remove the subscriber

▸ (): *void*

___

###  unsubscribe

▸ **unsubscribe**(`subscriber`: [StoreSubscriber](../modules/_src_storeawaiteventemitter_.md#storesubscriber)): *void*

Removes a subscriber

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`subscriber` | [StoreSubscriber](../modules/_src_storeawaiteventemitter_.md#storesubscriber) | The subscriber to be removed  |

**Returns:** *void*
