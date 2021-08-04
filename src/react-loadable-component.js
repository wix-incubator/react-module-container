// import React from 'react';
import BaseLazyComponent from './base-lazy-component';

export default function ReactLoadableComponent(name, resolve, files = []) {
  return class LoadableComponent extends BaseLazyComponent {
    constructor(props) {
      super(props, {component: name, files, resolve});
      this.state = {component: null};
    }

    componentDidMount() {
      this.resourceLoader.then(() => {
        if (this.resolvedData) {
          const component = this.resolvedData.default || this.resolvedData;
          if (component) {
            this.setState({ component });
          }
        }
      });
    }

    render() {
      if (this.state.error) {
        throw this.state.error;
      }

      return this.renderComponent();
    }
  };
}
