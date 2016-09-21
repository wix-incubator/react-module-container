
export class MyNgComp extends window.AngularLazyComponent {
  constructor(props) {
    super(props, {
      files: [`${props.topology.staticsUrl}ng.js`],
      module: 'myApp',
      component: 'my-comp'
    });
  }
}

window.ModuleRegistry.registerComponent('MyNgComp', () => MyNgComp);
