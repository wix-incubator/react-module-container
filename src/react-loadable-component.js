import React from 'react';
import BaseLazyComponent from './base-lazy-component';

export default function ReactLoadableComponent(name, resolve, files = [], fallback = null) {
  return class LoadableComponent extends BaseLazyComponent {
    constructor(props) {
      super(props, {component: name, files, resolve});
      this.state = {component: null};
    }

    componentDidMount() {
      this.resourceLoader.then(() => {
        const component = this.resolvedData.default || this.resolvedData;
        this.setState({component});
      });
    }

    render() {
      return this.state.component ? <this.state.component {...this.mergedProps}/> : fallback;
    }
  };
}
