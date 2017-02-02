import _ from 'lodash';

class ModuleRegistry {
  constructor() {
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
    const callbackKey = _.uniqueId('eventListener');
    _.set(this.eventListeners, [globalID, callbackKey], callback);
    return {
      remove: () => _.unset(this.eventListeners[globalID], callbackKey)
    };
  }

  notifyListeners(globalID, ...args) {
    const listenerCallbacks = this.eventListeners[globalID];
    if (!listenerCallbacks) {
      return;
    }
    _.forEach(listenerCallbacks, callback => invokeSafely(callback, args));
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
