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
    this.promise = filesAppender(this.manifest.files);
  }

  componentDidMount() {
    this.promise.then(() => {
      ModuleRegistry.notifyListeners('reactModuleContainer.componentReady', this.manifest.component);
      const component = ModuleRegistry.component(this.manifest.component);
      this.setState({component});
    });
  }

  componentWillUnmount() {
    ModuleRegistry.notifyListeners('reactModuleContainer.componentWillUnmount', this.manifest.component);
  }

  render() {
    return this.state.component ? <this.state.component {...this.props}/> : null;
  }
}

export default ReactLazyComponent;
