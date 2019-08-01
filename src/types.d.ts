import * as React from 'react';

export type File = string | {
  url: string;
  optional: boolean;
};

export type Files = (File | File[])[];

export interface Manifest {
  component: string;
  files: Files
  prepare?: () => Promise<void>;
  resolve?: () => Promise<any>;
  unloadStylesOnDestroy?: boolean;
  crossorigin?: boolean;
}

export abstract class BaseLazyComponent<P={},S={}> extends React.Component<P,S> {
  constructor (props: P, manifest: Manifest)
  static prefetch?: (...args: any[]) => Files
}

export class AngularLazyComponent<P={},S={}> extends BaseLazyComponent<P,S> {
  constructor(props: P, manifest: Manifest & { module: string })
}

export class ReactLazyComponent<P={},S={}> extends BaseLazyComponent<P,S> {}

export const ReactLoadableComponent: (name: string, resolve: () => Promise<{ default: React.ComponentType }>) => typeof ReactLazyComponent

interface AnyClass {
  new(...args: any): any;
}

export const ModuleRegistry: {
  registeredComponents: any;
  registeredMethods: any;
  eventListeners: any;
  modules: any;
  cleanAll(): void;
  registerModule<T extends AnyClass>(id: string, ModuleFactory: T, args?: Partial<ConstructorParameters<T>>): void;
  getModule<T extends Object>(id: string): T | undefined;
  getAllModules<T extends Object>(): T[];

  registerComponent<P=any>(componentId: string, componentFactory: () => React.ComponentType<P>): void;

  component(componentId: string): typeof ReactLazyComponent | undefined;
  component(componentId: string): typeof AngularLazyComponent | undefined;
  component(componentId: string): React.ComponentType | undefined;
  component<P=any>(componentId: string): React.FunctionComponent<P> | undefined;

  addListener(eventName: string, callback: (...arg: any[]) => void): { remove(): void };
  notifyListeners(eventName: string, ...arg: any[]): void;

  registerMethod(id: string, generator: () => Function): void;
  invoke(id: string, ...arg: any[]): any | undefined;
};

declare global {
  interface Window {
    ModuleRegistry: typeof ModuleRegistry
  }
}