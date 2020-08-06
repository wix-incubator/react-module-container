import React from 'react';
import ModuleRegistry from './module-registry';
import {filesAppender, unloadStyles} from './tag-appender';
import assign from 'lodash/assign';
import {LazyComponentLoadingError} from './ReactModuleContainerErrors';
import {Manifest} from './typings';

export default class BaseLazyComponent<T = unknown, S = unknown> extends React.Component<T, S> {
  manifest: Manifest;
  resolvedData?: unknown;
  resourceLoader?: Promise<void>;

  constructor(props: T, manifest: Manifest) {
    super(props);
    this.manifest = manifest;
  }

  get mergedProps() {
    return assign({}, this.props, this.resolvedData);
  }

  componentWillMount() {
    ModuleRegistry.notifyListeners('reactModuleContainer.componentStartLoading', this.manifest.component);

    const manifestPrepare = this.manifest.prepare;
    const prepare = manifestPrepare ? () => manifestPrepare() : () => undefined;

    const filesAppenderPromise = filesAppender(this.manifest.files, this.manifest.crossorigin).then(prepare);

    const resolvePromise = this.manifest.resolve ? this.manifest.resolve() : Promise.resolve({});

    this.resourceLoader = Promise.all([resolvePromise, filesAppenderPromise])
      .then(([resolvedData]) => {
        this.resolvedData = resolvedData;
        ModuleRegistry.notifyListeners('reactModuleContainer.componentReady', this.manifest.component);
      }).catch(err => {
        ModuleRegistry.notifyListeners('reactModuleContainer.error', new LazyComponentLoadingError(this.manifest.component, err));
      });
  }

  componentWillUnmount() {
    if (this.manifest.unloadStylesOnDestroy !== false) {
      unloadStyles(document, this.manifest.files);
    }
    ModuleRegistry.notifyListeners('reactModuleContainer.componentWillUnmount', this.manifest.component);
  }
}
