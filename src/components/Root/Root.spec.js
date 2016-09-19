import {expect} from 'chai';
import React from 'react';
import {mount} from 'enzyme';
import Root from './Root';
import {Provider} from 'react-redux';
import {createStore} from 'redux';
import counter from '../../reducers';
import setupDom from '../../../test/environment-browser';

class CounterDriver {
  component;

  when = {
    created: () => {
      const store = createStore(counter);
      this.component = mount(
        <Provider store={store}>
          <Root/>
        </Provider>
      );
      return this;
    },
    increment: () => {
      this.get.incrementButton().simulate('click');
      return this;
    },
    decrement: () => {
      this.get.decrementButton().simulate('click');
      return this;
    }
  }

  get = {
    incrementButton: () => this.component.find('.increment-button'),
    decrementButton: () => this.component.find('.decrement-button'),
    count: () => this.component.find('p')
  }
}

describe('Root component', () => {
  let driver;
  setupDom();

  beforeEach(() => {
    driver = new CounterDriver();
    driver.when.created();
  });

  it('should display count', () => {
    expect(driver.get.count().length).to.eql(1);
  });

  it('should increment', () => {
    driver.when.increment();
    expect(driver.get.count().text()).to.eql('1');
  });

  it('should decrement', () => {
    driver.when.decrement();
    expect(driver.get.count().text()).to.eql('-1');
  });
});
