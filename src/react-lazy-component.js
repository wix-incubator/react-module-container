import React from 'react';
import {filesAppender} from './tag-appender';

class ReactLazyComponent extends React.Component {
  constructor(props, manifest) {
    super(props);
    this.manifest = manifest;
    this.state = {component: null};
  }

  componentWillMount() {
    window.ModuleRegistry.notifyListeners('reactModuleContainer.componentStartLoading', this.manifest.component);
    this.promise = filesAppender(this.manifest.files);
  }

  componentDidMount() {
    this.promise.then(() => {
      window.ModuleRegistry.notifyListeners('reactModuleContainer.componentReady', this.manifest.component);
      const component = window.ModuleRegistry.component(this.manifest.component);
      this.setState({component});
    });
  }

  componentWillUnmount() {
    window.ModuleRegistry.notifyListeners('reactModuleContainer.componentWillUnmount', this.manifest.component);
  }

  render() {
    return this.state.component ? <this.state.component {...this.props}/> : null;
  }
}

export default ReactLazyComponent;
