export class ReactModuleContainerError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;

    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = (new Error(message)).stack;
    }
  }
}

export class UnregisteredMethodInvokedError extends ReactModuleContainerError {
  constructor(methodName) {
    super(`ModuleRegistry.invoke ${methodName} used but not yet registered`);
  }
}

export class UnregisteredComponentUsedError extends ReactModuleContainerError {
  constructor(componentId) {
    super(`ModuleRegistry.component ${componentId} used but not yet registered`);
  }
}

export class ListenerCallbackError extends ReactModuleContainerError {
  constructor(methodName, error) {
    super(`Error in listener callback of module registry method: ${methodName}`);
    this.stack = this.stack + error.stack;
  }
}
export class LazyComponentLoadingError extends ReactModuleContainerError {
  constructor(component, error) {
    super(`Error loading moduleRegistry lazy component ${component}`);
    this.stack = this.stack + error.stack;
  }
}

export class FileAppenderLoadError extends ReactModuleContainerError {
  constructor(error) {
    super('FilesAppender failed to load file');
    this.stack = this.stack + error.stack;
  }
}
