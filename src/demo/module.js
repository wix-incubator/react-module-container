/* global React, AngularLazyComponent, ReactLazyComponent, ModuleRegistry */
import {Link} from 'react-router';

export class MyNgComp extends AngularLazyComponent {
  constructor(props) {
    super(props, {
      files: [`${props.topology.staticsUrl}angular-module.bundle.js`],
      module: 'myApp',
      component: 'my-comp'
    });
  }
}

export class MyNgComp2 extends AngularLazyComponent {
  constructor(props) {
    super(props, {
      files: [`${props.topology.staticsUrl}angular-module.bundle.js`],
      module: 'myApp2',
      component: 'my-comp'
    });
  }
}

export class MyReactComp extends ReactLazyComponent {
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
    return (<div>
      <div onClick={() => this.handleClick()}>
        <div>React Counter (click me): <span id="counter">{this.state.counter}</span>!!!</div>
        <div id="value-in-react">{this.props.value}</div>
      </div>
      <div>
        <Link className={'react-link'} to="/ng-router-app/a">ng-route-app</Link>&nbsp;
        <Link className={'react-link'} to="/ui-router-app/">ui-route-app</Link>&nbsp;
      </div>
    </div>);
  }
}
Hello.propTypes = {
  value: React.PropTypes.string
};

export class MyNgComp4 extends AngularLazyComponent {
  constructor(props) {
    super(props, {
      unloadStylesOnDestroy: true,
      files: [
        `${props.topology.staticsUrl}angular-module.bundle.js`,
        `${props.topology.baseUrl}demo-shared.css`,
        `${props.topology.baseUrl}demo-4.css`
      ],
      module: 'myApp4',
      component: 'my-comp'
    });
  }
}

export class MyNgComp5 extends AngularLazyComponent {
  constructor(props) {
    super(props, {
      unloadStylesOnDestroy: true,
      files: [
        `${props.topology.staticsUrl}angular-module.bundle.js`,
        `${props.topology.baseUrl}demo-shared.css`,
        `${props.topology.baseUrl}demo-5.css`
      ],
      module: 'myApp5',
      component: 'my-comp'
    });
  }
}

ModuleRegistry.registerComponent('MyApp.MyNgComp', () => MyNgComp);
ModuleRegistry.registerComponent('MyApp2.MyNgComp', () => MyNgComp2);
ModuleRegistry.registerComponent('MyApp3.MyReactComp', () => MyReactComp);
ModuleRegistry.registerComponent('Hello', () => Hello);
ModuleRegistry.registerComponent('MyApp4.MyNgComp', () => MyNgComp4);
ModuleRegistry.registerComponent('MyApp5.MyNgComp', () => MyNgComp5);
