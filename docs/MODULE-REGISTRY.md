# Module Registry

Module Registry is the heart of React Module Container. It consists of the following:

* Components - React or Angular lazy modules that can be registered and loaded at the later stage.
* Events - A simple PubSub listener interface that allows some modules to subscribe to event updates by other modules.
* Methods - A simple RPC interface allowing one module to make a remote call that will be executed by another module.

## Components

### `registerComponent(uniqueName: string, factoryFn: Function): void`
```ts
ModuleRegistry.registerComponent('hotels.Dashboard', () => ComponentClass);
```

### `component(uniqueName: string): Component`
```ts
const ComponentClass = ModuleRegistry.component('hotels.Dashboard');
```

## Events

### `addListener(eventName: string, callbackFn: Function): { remove: Function }`
Adding listener return an object that contains `.remove()` method that will unsubscribe from the event.
```ts
const subscription = ModuleRegistry.addListener('core.SessionUpdate', function (session) {
  // consumer handles updated session here
});
subscription.remove();
```

### `notifyListeners(eventName: string): void`
```ts
ModuleRegistry.notifyListeners('core.SessionUpdate', session);
```

## Methods

### `registerMethod(uniqueName: string, methodFn: Function): void`
```ts
ModuleRegistry.registerMethod('inbox.getContactDetails', () => contactService.getContactDetails);
```

### `invoke(uniqueName: string): any`
```ts
const contactDetails = await ModuleRegistry.invoke('inbox.getContactDetails', 'johnsmith@example.com');
```

