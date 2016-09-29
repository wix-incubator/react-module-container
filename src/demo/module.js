import React from 'react';

export class MyNgComp extends window.AngularLazyComponent {
  constructor(props) {
    super(props, {
      files: [`${props.topology.staticsUrl}angular-module.bundle.js`],
      module: 'myApp',
      component: 'my-comp'
    });
  }
}

export class MyNgComp2 extends window.AngularLazyComponent {
  constructor(props) {
    super(props, {
      files: [`${props.topology.staticsUrl}angular-module.bundle.js`],
      module: 'myApp2',
      component: 'my-comp'
    });
  }
}

export class MyReactComp extends window.ReactLazyComponent {
  constructor(props) {
    super(props, {
      files: [`${props.topology.staticsUrl}react-module.bundle.js`],
      component: 'MyApp3.RealReactComp'
    });
  }
}

class Hello extends React.Component {
  constructor(props) {
    super(props);
    this.state = {counter: 0};
  }

  handleClick() {
    this.setState({counter: this.state.counter + 1});
  }

  render() {
    return <div onClick={() => this.handleClick()}>Hello World {this.props.value} {this.state.counter}!!!</div>;
  }
}
Hello.propTypes = {
  value: React.PropTypes.string
};

window.ModuleRegistry.registerComponent('MyApp.MyNgComp', () => MyNgComp);
window.ModuleRegistry.registerComponent('MyApp2.MyNgComp', () => MyNgComp2);
window.ModuleRegistry.registerComponent('MyApp3.MyReactComp', () => MyReactComp);
window.ModuleRegistry.registerComponent('Hello', () => Hello);
