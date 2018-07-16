import React = require("react")

export interface AngularLazyComponentOptions {
  files: string[];
  module: string;
  component: string;
  unloadStylesOnDestroy?: boolean;
}

export interface ReactLazyComponentOptions {
  files: string[];
  component: string;
}

export class AngularLazyComponentInstance extends React.Component<any, any> {
}

export class ReactLazyComponent<P, S = {}> extends React.Component<P, S> {
}

export const AngularLazyComponent: new (
  props: any,
  manifest?: AngularLazyComponentOptions
) => AngularLazyComponentInstance;
export const ModuleRegistry: any;