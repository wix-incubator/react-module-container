import * as React from 'react';
import { ModuleRegistry, ReactLazyComponent, AngularLazyComponent, ReactLoadableComponent } from '../src/types.d';

const plainObject = {};

class Module {
  constructor(private a: string, private b: string) {}
  init() {}
}

class SimpleComponent extends React.Component {
}

class SimpleReactLazyComponent extends ReactLazyComponent {}
class SimpleAngularLazyComponent extends AngularLazyComponent {}
const SimpleReactFunctionComponent: React.FunctionComponent = () => null;

ModuleRegistry.registerModule('module', Module, ['s']);

// Should fail
// ModuleRegistry.registerModule('module', Module, [1]);
// ModuleRegistry.registerModule('module', Module, ['x', 'y', 'z']);
// ModuleRegistry.registerModule('module', plainObject);

export const module = ModuleRegistry.getModule<Module>('module');
if (module) {
  module.init();
}

// Should fail
// export const SomeModule = ModuleRegistry.getModule('module');
// new SomeModule();
// module.init();

export const modules: Module[] = ModuleRegistry.getAllModules();

ModuleRegistry.registerComponent('simple-component', () => SimpleComponent)
ModuleRegistry.registerComponent('simple-react-lazy-component', () => SimpleReactLazyComponent)
ModuleRegistry.registerComponent('simple-angular-lazy-component', () => SimpleAngularLazyComponent)
ModuleRegistry.registerComponent('simple-angular-lazy-component', () => SimpleReactFunctionComponent)
ModuleRegistry.registerComponent('some-component', () => props => <div>{props.someProp}</div>);

ModuleRegistry.registerComponent('loadable-component', () =>
  ReactLoadableComponent('loadable-component', () =>
    import(/* webpackPrefetch: true */ './mock/component'),
  ),
);

// Should fail
// ModuleRegistry.registerComponent('component', SimpleComponent)
// ModuleRegistry.registerComponent('simple-angular-lazy-component', SimpleReactFunctionComponent)
// ModuleRegistry.registerComponent('simple-angular-lazy-component', () => plainObject)
// ModuleRegistry.registerComponent('loadable-component', () =>
//   ReactLoadableComponent('loadable-component', () =>
//     import(/* webpackPrefetch: true */ '../src/index'),
//   ),
// );

const SomeReactLazyComponent: typeof ReactLazyComponent | undefined = ModuleRegistry.component('some-component');

if (SomeReactLazyComponent && SomeReactLazyComponent.prefetch) {
  SomeReactLazyComponent.prefetch();

}
export const someReactLazyElement = SomeReactLazyComponent ? <SomeReactLazyComponent someProp="someProp" /> : null;


const SomeAngularLazyComponent: typeof AngularLazyComponent | undefined = ModuleRegistry.component('some-component');
export const someAngularLazyElement = SomeAngularLazyComponent ? <SomeAngularLazyComponent/> : null;

const SomeReactComponent: React.ComponentType | undefined = ModuleRegistry.component('some-component');
export const someElement = SomeReactComponent ? <SomeReactComponent/> : null;

const SomeFunctionComponent: React.FunctionComponent<{ someProps: string }> | undefined = ModuleRegistry.component<{ someProps: string }>('some-component');
export const someFunctionElement = SomeFunctionComponent ? <SomeFunctionComponent someProps="someProp"/> : null;

// Should fail
// export const someOtherReactLazyElement = <SomeReactLazyComponent someProp="someProp" />
// export const someOtherAngularLazyElement = <SomeAngularLazyComponent/>;
// export const someOtherElement = <SomeReactComponent/>;
// export const someOtherFunctionElement = <SomeFunctionComponent someProps="someProp"/>;

const listener = ModuleRegistry.addListener('some-event', (a, b) => {
  return a + b;
});
listener.remove();


ModuleRegistry.notifyListeners('some-event');
ModuleRegistry.notifyListeners('some-event', 1, 2, 3);

ModuleRegistry.registerMethod('some-method', () => () => 'hello');

// Should fail
// ModuleRegistry.registerMethod('some-method', () => 'hello');

ModuleRegistry.invoke('some-method');
const ret = ModuleRegistry.invoke('some-method', 1, 2, 3);
if (ret) {
  ret.something();
}

// Should fail
ret.something();

window.ModuleRegistry;
