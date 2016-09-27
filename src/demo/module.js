
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

window.ModuleRegistry.registerComponent('MyApp.MyNgComp', () => MyNgComp);
window.ModuleRegistry.registerComponent('MyApp2.MyNgComp', () => MyNgComp2);
window.ModuleRegistry.registerComponent('MyApp3.MyReactComp', () => MyReactComp);
