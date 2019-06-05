import set from 'lodash/set';
import unset from 'lodash/unset';
import forEach from 'lodash/forEach';
import uniqueId from 'lodash/uniqueId';

class ModuleRegistry {
  constructor() {
    this.registeredComponents = {};
    this.registeredMethods = {};
    this.eventListeners = {};
    this.modules = {};
  }

  cleanAll() {
    this.registeredComponents = {};
    this.registeredMethods = {};
    this.eventListeners = {};
    this.modules = {};
  }

  registerModule(globalID, ModuleFactory, args = []) {
    if (this.modules[globalID]) {
      throw new Error(`A module with id "${globalID}" is already registered`);
    }

    this.modules[globalID] = new ModuleFactory(...args);
  }

  getModule(globalID) {
    return this.modules[globalID];
  }

  getAllModules() {
    return Object.keys(this.modules).map(moduleId => this.modules[moduleId]);
  }

  registerComponent(globalID, generator) {
    this.registeredComponents[globalID] = generator;
  }

  component(globalID) {
    const generator = this.registeredComponents[globalID];
    if (!generator) {
      this.notifyListeners('ReactModuleContainerError', {
        type: 'UnregisteredComponentUsed',
        text: `ModuleRegistry.component ${globalID} used but not yet registered`
      });
      return undefined;
    }
    return generator();
  }

  addListener(globalID, callback) {
    const callbackKey = uniqueId('eventListener');
    set(this.eventListeners, [globalID, callbackKey], callback);
    return {
      remove: () => unset(this.eventListeners[globalID], callbackKey)
    };
  }

  notifyListeners(globalID, ...args) {
    const listenerCallbacks = this.eventListeners[globalID];
    if (!listenerCallbacks) {
      return;
    }
    forEach(listenerCallbacks, callback => invokeSafely(globalID, callback, args));
  }

  registerMethod(globalID, generator) {
    this.registeredMethods[globalID] = generator;
  }

  invoke(globalID, ...args) {
    const generator = this.registeredMethods[globalID];
    if (!generator) {
      this.notifyListeners('ReactModuleContainerError', {
        type: 'UnregisteredMethodInvoked',
        text: `ModuleRegistry.invoke ${globalID} used but not yet registered`
      });
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

function invokeSafely(globalID, callback, args) {
  try {
    callback(...args);
  } catch (err) {
    singleton.notifyListeners('ReactModuleContainerError', {
      type: 'ListenerCallbackError',
      text: `Error in listener callback of module registry method: ${globalID}`,
      error: err
    });
  }
}
