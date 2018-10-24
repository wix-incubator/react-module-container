import 'mocha';
import chai, {expect} from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import * as recompose from 'recompose';

chai.use(sinonChai);

import ModuleRegistry from '../src/module-registry';

describe('Module Registry', () => {
  const sandbox = sinon.sandbox.create();

  beforeEach(() => {
    ModuleRegistry.cleanAll();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should be able to register a module', () => {
    class MyModule {}
    ModuleRegistry.registerModule('GLOBAL_ID', MyModule);
    const result = ModuleRegistry.getModule('GLOBAL_ID');
    expect(result).to.be.an.instanceOf(MyModule);
  });

  it('should be able to pass parameters to the register a module', () => {
    class MyModule {
      constructor(name) {
        this.name = name;
      }
    }
    ModuleRegistry.registerModule('GLOBAL_ID', MyModule, ['DUMMY_NAME']);
    const result = ModuleRegistry.getModule('GLOBAL_ID');
    expect(result.name).to.eq('DUMMY_NAME');
  });

  it('should throw an error if the given module was already registered', () => {
    class MyModule {}
    expect(() => ModuleRegistry.registerModule('GLOBAL_ID', MyModule)).to.not.throw();
    expect(() => ModuleRegistry.registerModule('GLOBAL_ID', MyModule)).to.throw();
  });

  it('should be able to get all modules', () => {
    class MyModule1 {}
    class MyModule2 {}
    class MyModule3 {}
    ModuleRegistry.registerModule('GLOBAL_ID1', MyModule1);
    ModuleRegistry.registerModule('GLOBAL_ID2', MyModule2);
    ModuleRegistry.registerModule('GLOBAL_ID3', MyModule3);

    const allModules = ModuleRegistry.getAllModules();
    expect(allModules.length).to.eq(3);
    expect(allModules.find(m => m instanceof MyModule1)).to.be.an.instanceOf(MyModule1);
    expect(allModules.find(m => m instanceof MyModule2)).to.be.an.instanceOf(MyModule2);
    expect(allModules.find(m => m instanceof MyModule3)).to.be.an.instanceOf(MyModule3);
  });

  it('should be able to register a method and call it', () => {
    const method = sinon.spy();
    ModuleRegistry.registerMethod('GLOBAL_ID', () => method);
    ModuleRegistry.invoke('GLOBAL_ID', 1, 2, 3);
    expect(method).calledWith(1, 2, 3);
  });

  it('should be able to register a component', () => {
    const component = () => '<div>FAKE_COMPONENT</div>';
    ModuleRegistry.registerComponent('GLOBAL_ID', component);
    const resultComponent = ModuleRegistry.component('GLOBAL_ID');
    expect(resultComponent).to.eq('<div>FAKE_COMPONENT</div>');
  });

  it('should be able to register a component with defaultProps', () => {
    const componentName = 'GLOBAL_ID';
    const Component = () => null;
    const FakeWrappedComponent = () => null;
    const props = {someProps: 'somePropValue'};

    const hocStub = sandbox.stub();
    hocStub.withArgs(Component).returns(FakeWrappedComponent);
    sandbox.stub(recompose, 'defaultProps').withArgs(props).returns(hocStub);

    ModuleRegistry.registerComponentWithDefaultProps(componentName, Component, props);

    expect(ModuleRegistry.component(componentName)).to.equal(FakeWrappedComponent);
  });

  it('should notify all event listeners', () => {
    const listener1 = sinon.spy();
    const listener2 = sinon.spy();
    ModuleRegistry.addListener('GLOBAL_ID', listener1);
    ModuleRegistry.addListener('GLOBAL_ID', listener2);
    ModuleRegistry.notifyListeners('GLOBAL_ID', 1, 2, 3);
    expect(listener1).calledWith(1, 2, 3);
    expect(listener2).calledWith(1, 2, 3);
  });

  it('should clean all the methods, components, events, and modules when calling cleanAll', () => {
    ModuleRegistry.registerModule('GLOBAL_ID', class MyModule {});
    ModuleRegistry.registerMethod('GLOBAL_ID', () => () => {});
    ModuleRegistry.registerComponent('GLOBAL_ID', () => {});
    ModuleRegistry.addListener('GLOBAL_ID', () => {});

    ModuleRegistry.cleanAll();

    expect(ModuleRegistry.getModule('GLOBAL_ID')).to.be.undefined;
    expect(ModuleRegistry.notifyListeners('GLOBAL_ID')).to.be.undefined;
    expect(ModuleRegistry.component('GLOBAL_ID')).to.be.undefined;
    expect(ModuleRegistry.invoke('GLOBAL_ID')).to.be.undefined;
  });
});
