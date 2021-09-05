import React from 'react';
import { ReactLoadableComponent } from '../../src';

const SubComponent = ReactLoadableComponent('SomeSubComponentName', () => import('./SomeSubComponent'));

export default () => (
  <div data-hook="some-component-root">
    <div data-hook="component-title">Hello World!</div>
    <SubComponent/>
  </div>
);