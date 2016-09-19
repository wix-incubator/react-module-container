import React from 'react';
import {render} from 'react-dom';
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import Root from './components/Root/Root';
import counter from './reducers';

const store = createStore(counter);
const rootEl = document.getElementById('root');

render(
  <Provider store={store}>
    <Root/>
  </Provider>,
  rootEl
);
