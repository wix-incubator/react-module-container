export class ReactModuleContainerError extends Error {
  originalError?: Error;

  constructor(message: string) {
    super(message);

    /**
     * Set the prototype explicitly. Need this for Typescript
     * more: https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work
     */
    Object.setPrototypeOf(this, ReactModuleContainerError.prototype);

    this.name = this.constructor.name;

    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = (new Error(message)).stack;
    }
  }
}

export class UnregisteredMethodInvokedError extends ReactModuleContainerError {
  constructor(methodName: string) {
    super(`ModuleRegistry.invoke ${methodName} used but not yet registered`);
    Object.setPrototypeOf(this, UnregisteredMethodInvokedError.prototype);
    this.name = 'UnregisteredMethodInvokedError';
  }
}

export class UnregisteredComponentUsedError extends ReactModuleContainerError {
  constructor(componentId: string) {
    super(`ModuleRegistry.component ${componentId} used but not yet registered`);
    Object.setPrototypeOf(this, UnregisteredComponentUsedError.prototype);
    this.name = 'UnregisteredComponentUsedError';
  }
}

export class ListenerCallbackError extends ReactModuleContainerError {
  constructor(methodName: string, error: Error) {
    super(`Error in listener callback of module registry method: ${methodName}`);
    Object.setPrototypeOf(this, ListenerCallbackError.prototype);
    this.name = 'ListenerCallbackError';

    // @ts-ignore
    this.stack = this.stack + error.stack;
    this.originalError = error;
  }
}

export class LazyComponentLoadingError extends ReactModuleContainerError {
  constructor(component: string, error: Error) {
    super(`Error loading moduleRegistry lazy component ${component}`);
    Object.setPrototypeOf(this, LazyComponentLoadingError.prototype);
    this.name = 'LazyComponentLoadingError';

    // @ts-ignore
    this.stack = this.stack + error.stack;
    this.originalError = error;
  }
}

export class FileAppenderLoadError extends ReactModuleContainerError {
  constructor(fileUrl: string) {
    super(`FilesAppender failed to load file ${fileUrl}`);
    Object.setPrototypeOf(this, FileAppenderLoadError.prototype);
    this.name = 'FileAppenderLoadError';
  }
}
