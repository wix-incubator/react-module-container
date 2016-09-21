import React from 'react';
import {render} from 'react-dom';

const topology = {staticsUrl: 'http://localhost:3200/assets/'};
const rootElement = document.getElementById('root');
const MyNgComp = window.ModuleRegistry.component('MyNgComp');

render(
  <MyNgComp topology={topology} value={5}/>,
  rootElement
);
