/* global React, AngularLazyComponent, ReactLazyComponent, ModuleRegistry */
import {Link} from 'react-router';
import PropTypes from 'prop-types';

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
      resolve: () => {
        const experimentsPromise = Promise.resolve({'specs.fed.ReactModuleContainerWithResolve': true});
        const customDataPromise = Promise.resolve({user: 'xiw@wix.com'});
        return Promise.all([experimentsPromise, customDataPromise]).then(results => {
          return {
            experiments: results[0],
            customData: results[1]
          };
        });
      },
      module: 'myApp2',
      component: 'my-comp'
    });
  }
}

export class MyReactComp extends ReactLazyComponent {
  constructor(props) {
    super(props, {
      files: [`${props.topology.staticsUrl}react-module.bundle.js`],
      resolve: () => {
        const experimentsPromise = Promise.resolve({'specs.fed.ReactModuleContainerWithResolve': true});
        const customDataPromise = Promise.resolve({user: 'xiw@wix.com'});
        return Promise.all([experimentsPromise, customDataPromise]).then(results => {
          return {
            experiments: results[0],
            customData: results[1]
          };
        });
      },
      component: 'MyApp3.RealReactComp'
    });
  }
}

export class MyReactCompCrossOrigin extends ReactLazyComponent {
  constructor(props) {
    super(props, {
      files: [`${props.topology.staticsUrl}react-module.bundle.js`],
      crossorigin: true,
      component: 'MyApp6.RealReactCompCrossOrigin'
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
  value: PropTypes.string
};

export class MyNgComp4 extends AngularLazyComponent {
  constructor(props) {
    super(props, {
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

export class MyNgApp5NoUnloadCss extends MyNgComp5 {
  constructor(props) {
    super(props);
    this.manifest.unloadStylesOnDestroy = false;
  }
}

ModuleRegistry.registerComponent('MyApp.MyNgComp', () => MyNgComp);
ModuleRegistry.registerComponent('MyApp2.MyNgComp', () => MyNgComp2);
ModuleRegistry.registerComponent('MyApp3.MyReactComp', () => MyReactComp);
ModuleRegistry.registerComponent('Hello', () => Hello);
ModuleRegistry.registerComponent('MyApp4.MyNgComp', () => MyNgComp4);
ModuleRegistry.registerComponent('MyApp5.MyNgComp', () => MyNgComp5);
ModuleRegistry.registerComponent('MyApp5NoUnloadCss.MyNgComp', () => MyNgApp5NoUnloadCss);
ModuleRegistry.registerComponent('MyApp6.MyReactCompCrossOrigin', () => MyReactCompCrossOrigin);
