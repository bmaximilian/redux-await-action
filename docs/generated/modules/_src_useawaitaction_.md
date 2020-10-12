[redux-await-action](../README.md) › [Globals](../globals.md) › ["src/useAwaitAction"](_src_useawaitaction_.md)

# Module: "src/useAwaitAction"

## Index

### Type aliases

* [ActionTypes](_src_useawaitaction_.md#actiontypes)

### Functions

* [useAwaitAction](_src_useawaitaction_.md#useawaitaction)

## Type aliases

###  ActionTypes

Ƭ **ActionTypes**: *string | string[]*

## Functions

###  useAwaitAction

▸ **useAwaitAction**‹**S**›(): *function*

Creates the await action function

**Type parameters:**

▪ **S**: *Action*

**Returns:** *function*

- A function to wait for specific actions

▸ (`s`: [ActionTypes](_src_useawaitaction_.md#actiontypes), `e`: [ActionTypes](_src_useawaitaction_.md#actiontypes)): *Promise‹S›*

**Parameters:**

Name | Type |
------ | ------ |
`s` | [ActionTypes](_src_useawaitaction_.md#actiontypes) |
`e` | [ActionTypes](_src_useawaitaction_.md#actiontypes) |
