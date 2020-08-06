import React from 'react';
import set from 'lodash/set';
import unset from 'lodash/unset';
import forEach from 'lodash/forEach';
import uniqueId from 'lodash/uniqueId';
import {
  ListenerCallbackError, UnregisteredComponentUsedError,
  UnregisteredMethodInvokedError
} from './ReactModuleContainerErrors';

type ComponentGenerator = () => React.ComponentType<any> | null;
type MethodGenerator = () => (...args: unknown[]) => unknown;

export class ModuleRegistry {
  registeredComponents: {[globalId: string]: ComponentGenerator} = {};
  registeredMethods: {[globalId: string]: MethodGenerator} = {};
  eventListeners: {[globalId: string]: (...args: unknown[]) => unknown} = {};
  modules: {[globalId: string]: any} = {};

  cleanAll() {
    this.registeredComponents = {};
    this.registeredMethods = {};
    this.eventListeners = {};
    this.modules = {};
  }

  registerModule(globalID: string, ModuleFactory: any, args: unknown[] = []) {
    if (this.modules[globalID]) {
      throw new Error(`A module with id "${globalID}" is already registered`);
    }

    this.modules[globalID] = new ModuleFactory(...args);
  }

  getModule(globalID: string) {
    return this.modules[globalID];
  }

  getAllModules() {
    return Object.keys(this.modules).map(moduleId => this.modules[moduleId]);
  }

  registerComponent(globalID: string, generator: ComponentGenerator) {
    this.registeredComponents[globalID] = generator;
  }

  component(globalID: string) {
    const generator = this.registeredComponents[globalID];
    if (!generator) {
      this.notifyListeners('reactModuleContainer.error', new UnregisteredComponentUsedError(globalID));
      return undefined;
    }
    return generator();
  }

  addListener(globalID: string, callback: (...args: unknown[]) => unknown) {
    const callbackKey = uniqueId('eventListener');
    set(this.eventListeners, [globalID, callbackKey], callback);
    return {
      remove: () => unset(this.eventListeners[globalID], callbackKey)
    };
  }

  notifyListeners(globalID: string, ...args: unknown[]) {
    const listenerCallbacks = this.eventListeners[globalID];
    if (!listenerCallbacks) {
      return;
    }
    forEach(listenerCallbacks, callback => invokeSafely(globalID, callback, args));
  }

  registerMethod(globalID: string, generator: MethodGenerator) {
    this.registeredMethods[globalID] = generator;
  }

  invoke(globalID: string, ...args: unknown[]) {
    const generator = this.registeredMethods[globalID];
    if (!generator) {
      this.notifyListeners('reactModuleContainer.error', new UnregisteredMethodInvokedError(globalID));
      return undefined;
    }
    const method = generator();
    return method(...args);
  }
}

let singleton: ModuleRegistry;
if (typeof window !== 'undefined') {
  singleton = window.ModuleRegistry || new ModuleRegistry();
  window.ModuleRegistry = singleton;
} else {
  singleton = new ModuleRegistry();
}
export default singleton;

function invokeSafely(globalID: string, callback: (...args: unknown[]) => void, args: unknown[]) {
  try {
    callback(...args);
  } catch (err) {
    singleton.notifyListeners('reactModuleContainer.error', new ListenerCallbackError(globalID, err));
  }
}
