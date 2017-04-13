import set from 'lodash/set';
import unset from 'lodash/unset';
import forEach from 'lodash/forEach';
import uniqueId from 'lodash/uniqueId';

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
      const keys = this.splitGlobalKey(globalID);
      const componentLeafKey = keys[keys.length - 1];
      const registeredComponentNameSpace = this.buildNameSpace(keys, this.registeredComponents);
      registeredComponentNameSpace[componentLeafKey] = generator;
  }

    /**
    * Splits a string key into an array if possible,
    * if not returns the key as an array
    * @param globalID
    * @returns {*}
    */
  splitGlobalKey(globalID) {
        if (typeof globalID === 'string') {
            if (globalID.indexOf('.') > -1) {
                return globalID.split('.');
            } else {
                return [globalID];
            }
        } else {
            throw new Error('globalId must be a string');
        }
    }

    /**
     * Creates a NS in an object (if missing) and navigates to it
     * @param parts - the parts of the path Array
     * @param pathObj - the object we are enhancing and fetching from
     * @returns {*}
     */
  buildNameSpace(parts, pathObj){
      let currentPart =  pathObj;
      for(let i =0; i< (parts.length -1); i++) {
        if (!currentPart[parts[i]]){
            currentPart[parts[i]] = {};
        }
        currentPart = currentPart[parts[i]]
      }
      return currentPart;
  }

    /**
     * Gets a leaf from a namespace path
     * @param globalID - string path separated by '.'
     * @param pathObj - the object that should contain the leaf
     * @returns {*}
     */
  getFromNameSpace(globalID, pathObj){
      let keys = this.splitGlobalKey(globalID);
      let currentKey = pathObj;
      for(let i = 0; i < keys.length; i++){
         if(currentKey[keys[i]]){
             currentKey = currentKey[keys[i]];
         } else {
             currentKey = undefined;
             break;
         }
      }
      return currentKey;
  }

  component(globalID) {
    const generator = this.getFromNameSpace(globalID, this.registeredComponents);
    if (!generator) {
      console.error(`ModuleRegistry.component ${globalID} used but not yet registered`);
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
    forEach(listenerCallbacks, callback => invokeSafely(callback, args));
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
