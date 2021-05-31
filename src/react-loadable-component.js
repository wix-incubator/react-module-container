import React from 'react';
import BaseLazyComponent from './base-lazy-component';

export default function ReactLoadableComponent(name, resolve, files = []) {
  return class LoadableComponent extends BaseLazyComponent {
    constructor(props) {
      super(props, {component: name, files, resolve});
      this.state = {component: null};
    }

    componentDidMount() {
      this.resourceLoader.then(() => {
        if (this.this.resolvedData) {
          const component = this.resolvedData.default || this.resolvedData;
          if (component) {
            this.setState({ component });
          }
        }
      });
    }

    render() {
      return this.state.component ? <this.state.component {...this.mergedProps}/> : null;
    }
  };
}
