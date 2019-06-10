export class UnregisteredMethodInvokedError extends Error {
  constructor(methodName) {
    super();

    Object.setPrototypeOf(this, UnregisteredMethodInvokedError.prototype);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, UnregisteredMethodInvokedError);
    }

    this.name = 'UnregisteredMethodInvoked';
    this.message = `ModuleRegistry.invoke ${methodName} used but not yet registered`;
  }
}
