class ModuleRegistry {
  constructor() {
    this.uniqueId = 0;
    this.registeredComponents = {};
    this.registeredMethods = {};
    this.eventListeners = {};
  }

  cleanAll() {
    this.registeredComponents = {};
    this.registeredMethods = {};
    this.eventListeners = {};
  }

  registerComponent(globalID, generator) {
    this.registeredComponents[globalID] = generator;
  }

  component(globalID) {
    const generator = this.registeredComponents[globalID];
    if (!generator) {
      console.error(`ModuleRegistry.component ${globalID} used but not yet registered`);
      return undefined;
    }
    return generator();
  }

  addListener(globalID, callback) {
    const callbackKey = `eventListener_${this.uniqueId++}`;
    this.eventListeners[globalID] = this.eventListeners[globalID] || {};
    this.eventListeners[globalID][callbackKey] = callback;
    return {
      remove: () => delete this.eventListeners[globalID][callbackKey]
    };
  }

  notifyListeners(globalID, ...args) {
    const listenerCallbacks = this.eventListeners[globalID];
    if (!listenerCallbacks) {
      return;
    }
    Object.keys(listenerCallbacks).forEach(key => invokeSafely(listenerCallbacks[key], args));
  }

  registerMethod(globalID, generator) {
    this.registeredMethods[globalID] = generator;
  }

  invoke(globalID, ...args) {
    const generator = this.registeredMethods[globalID];
    if (!generator) {
      console.error(`ModuleRegistry.invoke ${globalID} used but not yet registered`);
      return undefined;
    }
    const method = generator();
    return method(...args);
  }
}

let singleton;
if (typeof window !== 'undefined') {
  singleton = window.ModuleRegistry || new ModuleRegistry();
  window.ModuleRegistry = singleton;
} else {
  singleton = new ModuleRegistry();
}
export default singleton;

function invokeSafely(callback, args) {
  try {
    callback(...args);
  } catch (err) {
    console.error(err);
  }
}
