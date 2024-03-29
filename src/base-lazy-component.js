import React from 'react';
import ModuleRegistry from './module-registry';
import {filesAppender, unloadStyles} from './tag-appender';
import assign from 'lodash/assign';
import {LazyComponentLoadingError} from './ReactModuleContainerErrors';
import { ReactModuleContainerContext } from './context';

export default class BaseLazyComponent extends React.Component {
  static contextType = ReactModuleContainerContext;

  constructor(props, manifest) {
    super(props);
    this.manifest = manifest;
  }

  get mergedProps() {
    return assign({}, this.props, this.resolvedData);
  }

  hasSuspensePayload() {
    return !!this.context?.suspensePayload;
  }

  setupSuspensePayload() {
    if (!this.context?.suspense) {
      return;
    }

    const suspensePayload = this.context.suspensePayload = {};
    suspensePayload.promise = this.resourceLoader.then(() => {
      // Store the resolvedData from the suspended instance to be reloaded in the new component instance
      suspensePayload.resolvedData = this.resolvedData;
    });
  }

  handleSuspenseRender() {
    if (!this.context?.suspense) {
      return;
    }

    const { suspensePayload } = this.context;
    const isResolved = !!suspensePayload.resolvedData;

    if (!isResolved) {
      throw suspensePayload.promise;
    }

    // Promise is resolved, restore the data from the suspended instance to the instance
    if (!this.resolvedData) {
      this.resolvedData = suspensePayload.resolvedData;
      this.resourceLoader = suspensePayload.promise;
    }
  }

  UNSAFE_componentWillMount() {
    if (this.hasSuspensePayload()) {
      // All of this already happened, we just wait for the previous promise to resolve and we'll restore the needed state.
      return;
    }

    ModuleRegistry.notifyListeners('reactModuleContainer.componentStartLoading', this.manifest.component);
    const prepare = this.manifest.prepare ? () => this.manifest.prepare() : () => undefined;
    const filesAppenderPromise = filesAppender(this.manifest.files, this.manifest.crossorigin).then(prepare);
    const resolvePromise = this.manifest.resolve ? this.manifest.resolve() : Promise.resolve({});
    this.resourceLoader = Promise.all([resolvePromise, filesAppenderPromise]).then(([resolvedData]) => {
      this.resolvedData = resolvedData;
      ModuleRegistry.notifyListeners('reactModuleContainer.componentReady', this.manifest.component);
    }).catch(err => {
      ModuleRegistry.notifyListeners('reactModuleContainer.error', new LazyComponentLoadingError(this.manifest.component, err));
      this.setState({
        error: err,
      });
    });

    // This component instance will be thrown away and a new one created when the promise is resolved.
    // Store the promise and reference to the data from this instance
    this.setupSuspensePayload();
  }

  componentWillUnmount() {
    if (this.manifest.unloadStylesOnDestroy !== false) {
      unloadStyles(document, this.manifest.files);
    }
    ModuleRegistry.notifyListeners('reactModuleContainer.componentWillUnmount', this.manifest.component);
  }

  renderComponent() {
    this.handleSuspenseRender();

    // Make sure any context does not propagate to any children (otherwise this can enter an infinite loop since it's working on the same payload instance)
    return this.state.component ? <ReactModuleContainerContext.Provider value={null}><this.state.component {...this.mergedProps}/></ReactModuleContainerContext.Provider> : null;
  }
}
