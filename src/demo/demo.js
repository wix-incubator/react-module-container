import React from 'react';
import {render} from 'react-dom';
import ModuleRegistry from '../module-registry';

const topology = {staticsUrl: 'http://localhost:3200/assets/'};
const rootElement = document.getElementById('root');
const MyApp = {MyNgComp: ModuleRegistry.component('MyApp.MyNgComp')};

render(
  <MyApp.MyNgComp topology={topology} value={5}/>,
  rootElement
);
