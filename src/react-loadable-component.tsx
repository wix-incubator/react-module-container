import React from 'react';
import {FileConfig} from './typings';
import {ReactLazyComponentState} from './react-lazy-component';
import BaseLazyComponent from './base-lazy-component';

export default function ReactLoadableComponent(name: string, resolve: (...args: unknown[]) => Promise<unknown>, files: (string | FileConfig)[] = []) {
  return class LoadableComponent extends BaseLazyComponent {
    state: ReactLazyComponentState = {
      component: null
    };

    constructor(props: unknown) {
      super(props, {component: name, files, resolve});
      this.state = {component: null};
    }

    componentDidMount() {
      this.resourceLoader?.then(() => {
        // @ts-ignore
        const component = this.resolvedData?.default || this.resolvedData;
        this.setState({component});
      });
    }

    render() {
      if (!this.state.component) {
        return null;
      }
      return <this.state.component {...this.mergedProps}/>;
    }
  };
}
