import React from 'react';
import {tagAppender} from './tag-appender';

class ReactLazyComponent extends React.Component {
  constructor(props, manifest) {
    super(props);
    this.manifest = manifest;
    this.state = {component: null};
  }

  componentWillMount() {
    this.promise = Promise.all(this.manifest.files.map(file => {
      return tagAppender(file, file.split('.').pop());
    }));
  }

  componentDidMount() {
    this.promise.then(() => {
      const component = window.ModuleRegistry.component(this.manifest.component);
      this.setState({component});
    });
  }

  render() {
    return this.state.component ? <this.state.component {...this.props}/> : null;
  }
}

export default ReactLazyComponent;
