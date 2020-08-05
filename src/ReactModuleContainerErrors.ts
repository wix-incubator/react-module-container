export class ReactModuleContainerError extends Error {
  originalError?: Error;

  constructor(message: string) {
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
  constructor(methodName: string) {
    super(`ModuleRegistry.invoke ${methodName} used but not yet registered`);
    this.name = 'UnregisteredMethodInvokedError';
  }
}

export class UnregisteredComponentUsedError extends ReactModuleContainerError {
  constructor(componentId: string) {
    super(`ModuleRegistry.component ${componentId} used but not yet registered`);
    this.name = 'UnregisteredComponentUsedError';
  }
}

export class ListenerCallbackError extends ReactModuleContainerError {
  constructor(methodName: string, error: Error) {
    super(`Error in listener callback of module registry method: ${methodName}`);
    this.name = 'ListenerCallbackError';

    // @ts-ignore
    this.stack = this.stack + error.stack;
    this.originalError = error;
  }
}

export class LazyComponentLoadingError extends ReactModuleContainerError {
  constructor(component: string, error: Error) {
    super(`Error loading moduleRegistry lazy component ${component}`);
    this.name = 'LazyComponentLoadingError';

    // @ts-ignore
    this.stack = this.stack + error.stack;
    this.originalError = error;
  }
}

export class FileAppenderLoadError extends ReactModuleContainerError {
  constructor(fileUrl: string) {
    super(`FilesAppender failed to load file ${fileUrl}`);
    this.name = 'FileAppenderLoadError';
  }
}
