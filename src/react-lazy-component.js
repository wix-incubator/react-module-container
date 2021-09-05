import ModuleRegistry from './module-registry';
import BaseLazyComponent from './base-lazy-component';

class ReactLazyComponent extends BaseLazyComponent {
  constructor(props, manifest) {
    super(props, manifest);
    this.state = {component: null};
  }

  componentDidMount() {
    this.resourceLoader.then(() => {
      const component = ModuleRegistry.component(this.manifest.component);
      this.setState({component});
    });
  }

  render() {
    return this.renderComponent();
  }
}

export default ReactLazyComponent;
