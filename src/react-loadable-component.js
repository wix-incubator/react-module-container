import React from 'react';
import BaseLazyComponent from './base-lazy-component';

export default function ReactLoadableComponent(name, resolve) {
  return class LoadableComponent extends BaseLazyComponent {
    constructor(props) {
      super(props, { component: name, files: [], resolve });
      this.state = { component: null };
    }

    componentDidMount() {
      this.resourceLoader.then(() => {
        this.setState({ component: this.resolvedData.default });
      });
    }

    render() {
      return this.state.component ? (
        <this.state.component {...this.props} />
      ) : null;
    }
  };
}
