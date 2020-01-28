import {React} from 'react';

export as namespace ModuleContainer;

export type LifecycleEvent =
  'reactModuleContainer.componentStartLoading' |
  'reactModuleContainer.componentReady' |
  'reactModuleContainer.componentWillUnmount' |
  'reactModuleContainer.error';

export interface LazyComponentOptions {
  files: string[];
  component: string;
  resolve: () => Promise<any>;
  unloadStylesOnDestroy?: boolean;
}

export const ModuleRegistry: {
  addListener(lifecycleEvent: LifecycleEvent, callback: (appName: string) => void);
  registerComponent(appId: string, component: () => React.ReactLazyComponent<unknown>): void;
};

export class ReactLazyComponent<T> extends React.ComponentClass<T> {
  constructor(props: any, manifest: LazyComponentOptions);
}
