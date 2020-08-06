/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference types="node" />
/// <reference types="react" />
/// <reference types="react-dom" />

interface Window {
  angular: import('angular').IAngularStatic;
  requirejs: (...args: unknown[]) => unknown;
  ModuleRegistry: import('./module-registry');
  ReactLazyComponent: import('./react-lazy-component');
  AngularLazyComponent: import('./angular-lazy-component');
  ReactLoadableComponent: import('./react-loadable-component');
}

declare module '*.scss' {
  const classes: { [key: string]: string };
  export = classes;
}

declare module '*.sass' {
  const classes: { [key: string]: string };
  export = classes;
}
