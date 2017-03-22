import {expect} from 'chai';
import {spy} from 'sinon';

import ModuleRegistry from './module-registry';

describe('Component ModuleRegistry', () => {

  beforeEach(() => {
    ModuleRegistry.clearListeners();
  });

  it('should allow registering listener', () => {
    const listener = spy();
    ModuleRegistry.addListener('A', listener);
    ModuleRegistry.notifyListeners('A', 'Hello', 'World', '!');
    expect(listener.calledWith('Hello', 'World', '!'));
  });

  it('should allow removing listener', () => {
    const listener = spy();
    ModuleRegistry.addListener('A', listener).remove();
    ModuleRegistry.notifyListeners('A');
    expect(listener.called).to.be.false;
  });

  it('should notify listerners matching the globalID', () => {
    const listenerHello = spy();
    const listenerWorld = spy();
    ModuleRegistry.addListener('Hello', listenerHello);
    ModuleRegistry.addListener('World', listenerWorld);
    ModuleRegistry.notifyListeners('Hello');
    expect(listenerHello.calledOnce).to.be.true;
    expect(listenerWorld.called).to.be.false;
  });

  it('should notify multiple listeners', () => {
    const listener1 = spy();
    const listener2 = spy();
    ModuleRegistry.addListener('A', listener1);
    ModuleRegistry.addListener('A', listener2);
    ModuleRegistry.notifyListeners('A');
    expect(listener1.calledOnce).to.be.true;
    expect(listener2.calledOnce).to.be.true;
  });

});
