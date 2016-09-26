
export class MyNgComp extends window.AngularLazyComponent {
  constructor(props) {
    super(props, {
      files: [`${props.topology.staticsUrl}ng.js`],
      module: 'myApp',
      component: 'my-comp'
    });
  }
}

export class MyNgComp2 extends window.AngularLazyComponent {
  constructor(props) {
    super(props, {
      files: [`${props.topology.staticsUrl}ng.js`],
      module: 'myApp2',
      component: 'my-comp'
    });
  }
}

window.ModuleRegistry.registerComponent('MyApp.MyNgComp', () => MyNgComp);
window.ModuleRegistry.registerComponent('MyApp2.MyNgComp', () => MyNgComp2);
