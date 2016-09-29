import React from 'react';
import {render} from 'react-dom';
import ModuleRegistry from '../module-registry';
import {Router, Route, browserHistory, Link, IndexRoute, withRouter} from 'react-router';
import {activeLink} from './demo.scss';

const topology = {staticsUrl: 'http://localhost:3200/lazy/'};
const rootElement = document.getElementById('root');
const MyApp = {MyNgComp: ModuleRegistry.component('MyApp.MyNgComp')};
const MyApp2 = {MyNgComp: ModuleRegistry.component('MyApp2.MyNgComp')};
const MyApp3 = {MyReactComp: ModuleRegistry.component('MyApp3.MyReactComp')};

const SplatLink = withRouter(props => {
  const newProps = {to: props.to};
  if (props.router.isActive({pathname: props.to + (props.params.splat || '')})) {
    newProps.style = {...props.style, ...props.activeStyle};
    newProps.className = `${props.className || ''} ${props.activeClassName || ''}`;
  }
  return <Link {...newProps}>{props.children}</Link>;
});
const Navigation = props => (
  <div>
    <SplatLink {...props} to="/my-app/" activeClassName={activeLink}>my app</SplatLink>&nbsp;
    <SplatLink {...props} to="/my-app2/" activeClassName={activeLink}>my app 2</SplatLink>&nbsp;
    <SplatLink {...props} to="/my-app3/" activeClassName={activeLink}>my app 3</SplatLink>&nbsp;
    <div>{props.children}</div>
  </div>
);
Navigation.propTypes = {
  children: React.PropTypes.any
};

const Home = () => <span>hello</span>;
const App = withRouter(props => <MyApp.MyNgComp topology={topology} value={5} {...props}/>);
const App2 = withRouter(props => <MyApp2.MyNgComp topology={topology} value={5} {...props}/>);
const App3 = withRouter(props => <MyApp3.MyReactComp topology={topology} value={5} {...props}/>);
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
