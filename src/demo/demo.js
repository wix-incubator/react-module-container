import React from 'react';
import {render} from 'react-dom';
import ModuleRegistry from '../module-registry';
import {Router, Route, browserHistory, Link, IndexRoute} from 'react-router';

const topology = {staticsUrl: 'http://localhost:3200/lazy/'};
const rootElement = document.getElementById('root');
const MyApp = {MyNgComp: ModuleRegistry.component('MyApp.MyNgComp')};
const MyApp2 = {MyNgComp: ModuleRegistry.component('MyApp2.MyNgComp')};
const MyApp3 = {MyReactComp: ModuleRegistry.component('MyApp3.MyReactComp')};

const Navigation = props => (
  <div>
    <Link to="/my-app/">my app</Link>&nbsp;
    <Link to="/my-app2/">my app 2</Link>&nbsp;
    <Link to="/my-app3/">my app 3</Link>&nbsp;
    <div>{props.children}</div>
  </div>
);
Navigation.propTypes = {
  children: React.PropTypes.any
};

const Home = () => <span>hello</span>;
const App = () => <MyApp.MyNgComp topology={topology} value={5}/>;
const App2 = () => <MyApp2.MyNgComp topology={topology} value={5}/>;
const App3 = () => <MyApp3.MyReactComp topology={topology} value={5}/>;
render(
  <Router history={browserHistory}>
    <Route path="/" component={Navigation}>
      <IndexRoute component={Home}/>
      <Route path="/my-app/**" component={App}/>
      <Route path="/my-app2/**" component={App2}/>
      <Route path="/my-app3/**" component={App3}/>
    </Route>
  </Router>,
  rootElement
);
