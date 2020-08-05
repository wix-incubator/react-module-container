/// <reference types="yoshi/types" />
/// <reference types="jest-yoshi-preset/types" />

interface Window {
  angular: import('angular').IAngularStatic;
  requirejs: (...args: unknown[]) => unknown;
  ModuleRegistry: import('./module-registry');
  ReactLazyComponent: import('./react-lazy-component');
  AngularLazyComponent: import('./angular-lazy-component');
  ReactLoadableComponent: import('./react-loadable-component');
}
