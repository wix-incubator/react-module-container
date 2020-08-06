import React from 'react';
import {Link} from 'react-router';
import PropTypes from 'prop-types';
import {ReactLazyComponent, AngularLazyComponent, ModuleRegistry} from '../index';

export class MyNgComp extends AngularLazyComponent {
  constructor(props: {topology: {staticsUrl: string}}) {
    super(props, {
      files: [`${props.topology.staticsUrl}angular-module.bundle.js`],
      module: 'myApp',
      component: 'my-comp'
    });
  }
}

export class MyNgComp2 extends AngularLazyComponent {
  constructor(props: {topology: {staticsUrl: string}}) {
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
  constructor(props: {topology: {staticsUrl: string}}) {
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
  constructor(props: {topology: {staticsUrl: string}}) {
    super(props, {
      files: [`${props.topology.staticsUrl}react-module.bundle.js`],
      crossorigin: true,
      component: 'MyApp6.RealReactCompCrossOrigin'
    });
  }
}

class Hello extends React.Component<{value: string}> {
  public static readonly propTypes = {
    value: PropTypes.string
  };

  state = {
    counter: 0,
  };

  constructor(props: { value: string }) {
    super(props);
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

export class MyNgComp4 extends AngularLazyComponent {
  constructor(props: {topology: {staticsUrl: string; baseUrl: string}}) {
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
  constructor(props: {topology: {staticsUrl: string; baseUrl: string}}) {
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
  constructor(props: {topology: {staticsUrl: string; baseUrl: string}}) {
    super(props);
    (this as any).manifest.unloadStylesOnDestroy = false;
  }
}

export class MyReactComp7 extends ReactLazyComponent {
  constructor(props: {topology: {staticsUrl: string; baseUrl: string}}) {
    super(props, {
      files: [
        `${props.topology.staticsUrl}react-module.bundle.js`,
        `${props.topology.baseUrl}demo-shared.css`,
        `${props.topology.baseUrl}demo-4.css`
      ],
      component: 'MyApp7.RealReactComp'
    });
  }
}

export class MyReactComp8 extends ReactLazyComponent {
  constructor(props: {topology: {staticsUrl: string; baseUrl: string}}) {
    super(props, {
      files: [
        `${props.topology.staticsUrl}react-module.bundle.js`,
        `${props.topology.baseUrl}demo-shared.css`,
        `${props.topology.baseUrl}demo-5.css`
      ],
      component: 'MyApp7.RealReactComp',
      unloadStylesOnDestroy: false
    });
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
ModuleRegistry.registerComponent('MyApp7.MyReactComp', () => MyReactComp7);
ModuleRegistry.registerComponent('MyApp8.MyReactComp', () => MyReactComp8);
