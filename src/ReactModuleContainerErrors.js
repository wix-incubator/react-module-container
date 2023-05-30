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
    this.name = 'UnregisteredMethodInvokedError';
  }
}

export class UnregisteredComponentUsedError extends ReactModuleContainerError {
  constructor(componentId) {
    super(`ModuleRegistry.component ${componentId} used but not yet registered`);
    this.name = 'UnregisteredComponentUsedError';
  }
}

export class ListenerCallbackError extends ReactModuleContainerError {
  constructor(methodName, error) {
    super(`Error in listener callback of module registry method: ${methodName}`);
    this.name = 'ListenerCallbackError';
    this.stack = this.stack + error.stack;
    this.originalError = error;
  }
}

export class LazyComponentLoadingError extends ReactModuleContainerError {
  constructor(component, error) {
    super(`Error loading moduleRegistry lazy component ${component}`);
    this.name = 'LazyComponentLoadingError';
    this.stack = this.stack + error.stack;
    this.originalError = error;
  }
}

export class FileAppenderLoadError extends ReactModuleContainerError {
  constructor(fileUrl) {
    super(`FilesAppender failed to load file ${fileUrl}`);
    this.name = 'FileAppenderLoadError';
  }
}

export class ModuleAlreadyRegisteredError extends ReactModuleContainerError {
  constructor(moduleId) {
    super(`A module with id "${moduleId}" is already registered`);
    this.name = 'ModuleAlreadyRegisteredError';
  }
}
