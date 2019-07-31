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

export const module: Module = ModuleRegistry.getModule('module');
module.init();

// Should fail
// export const SomeModule = ModuleRegistry.getModule('module');
// new SomeModule();

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

const SomeReactLazyComponent: typeof ReactLazyComponent = ModuleRegistry.component('some-component');

if (SomeReactLazyComponent.prefetch) {
  SomeReactLazyComponent.prefetch();
}
export const someReactLazyElement = <SomeReactLazyComponent someProp="someProp" />;

const SomeAngularLazyComponent: typeof AngularLazyComponent = ModuleRegistry.component('some-component');
export const someAngularLazyElement = <SomeAngularLazyComponent/>;

const SomeReactComponent: React.ComponentType = ModuleRegistry.component('some-component');
export const someElement = <SomeReactComponent/>;

const SomeFunctionComponent: React.FunctionComponent<{ someProps: string }> = ModuleRegistry.component<{ someProps: string }>('some-component');
export const someFunctionElement = <SomeFunctionComponent someProps="someProp"/>;


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
ModuleRegistry.invoke('some-method', 1, 2, 3);

window.ModuleRegistry;
