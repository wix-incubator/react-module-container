import React from 'react';
import {filesAppender} from './tag-appender';
import ModuleRegistry from './module-registry';

class ReactLazyComponent extends React.Component {
  constructor(props, manifest) {
    super(props);
    this.manifest = manifest;
    this.state = {component: null};
  }

  componentWillMount() {
    ModuleRegistry.notifyListeners('reactModuleContainer.componentStartLoading', this.manifest.component);
    this.filesAppenderPromise = filesAppender(this.manifest.files);
    this.resolvePromise = this.manifest.resolve ? this.manifest.resolve() : Promise.resolve({});
  }

  componentDidMount() {
    Promise.all([this.filesAppenderPromise, this.resolvePromise]).then(results => {
      this.resolvedProps = results[1];
      ModuleRegistry.notifyListeners('reactModuleContainer.componentReady', this.manifest.component);
      const component = ModuleRegistry.component(this.manifest.component);
      this.setState({component});
    });
  }

  componentWillUnmount() {
    ModuleRegistry.notifyListeners('reactModuleContainer.componentWillUnmount', this.manifest.component);
  }

  render() {
    return this.state.component ? <this.state.component {...this.props} {...this.resolvedProps}/> : null;
  }
}

export default ReactLazyComponent;
