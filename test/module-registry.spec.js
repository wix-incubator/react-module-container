import 'mocha';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

chai.use(sinonChai);

import ModuleRegistry from '../src/module-registry';

describe('Module Registry.', () => {
  beforeEach(() => {
    ModuleRegistry.cleanAll();
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
    const resultComponent =ModuleRegistry.component('GLOBAL_ID');
    expect(resultComponent).to.eq('<div>FAKE_COMPONENT</div>');
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
});
