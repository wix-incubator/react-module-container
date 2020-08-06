import React from 'react';
import ModuleRegistry from './module-registry';
import BaseLazyComponent from './base-lazy-component';
import {Manifest} from './typings';

export interface ReactLazyComponentState {
  component: React.ComponentType | React.StatelessComponent | null | undefined;
}

export class ReactLazyComponent extends BaseLazyComponent<unknown, ReactLazyComponentState> {
  state: ReactLazyComponentState = {
    component: null
  };

  constructor(props: unknown, manifest: Manifest) {
    super(props, manifest);
    this.state = {component: null};
  }

  componentDidMount() {
    this.resourceLoader?.then(() => {
      const component = ModuleRegistry.component(this.manifest.component);
      this.setState({component});
    });
  }

  render() {
    if (!this.state.component) {
      return null;
    }

    return <this.state.component {...this.mergedProps}/>;
  }
}

export default ReactLazyComponent;
