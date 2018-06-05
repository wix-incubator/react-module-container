import React from 'react';
import PropTypes from 'prop-types';
import {render} from 'react-dom';
import {createStore} from 'redux';
import {Provider, connect} from 'react-redux';
import ModuleRegistry from '../module-registry';
import {EventsListener} from './EventListener';
import {Router, Route, browserHistory, Link, IndexRoute, withRouter} from 'react-router';

import {activeLink} from './demo.scss';

const store = createStore((state = 'react-input-value', action) => {
  return action.type === 'assign' ? action.value : state;
});
const withStore = connect(
  state => ({value: state}),
  dispatch => ({assign: value => dispatch({type: 'assign', value})})
);

const topology = {
  staticsUrl: 'http://localhost:3200/lazy/',
  baseUrl: 'http://localhost:3200/'
};
const rootElement = document.getElementById('root');
const MyApp = {MyNgComp: ModuleRegistry.component('MyApp.MyNgComp')};
const MyApp2 = {MyNgComp: ModuleRegistry.component('MyApp2.MyNgComp')};
const MyApp3 = {MyReactComp: ModuleRegistry.component('MyApp3.MyReactComp')};
const MyApp4 = {MyNgComp: ModuleRegistry.component('MyApp4.MyNgComp')};
const MyApp5 = {MyNgComp: ModuleRegistry.component('MyApp5.MyNgComp')};
const MyApp5NoUnloadCss = {MyNgComp: ModuleRegistry.component('MyApp5NoUnloadCss.MyNgComp')};
const MyApp6 = {MyReactCompCrossOrigin: ModuleRegistry.component('MyApp6.MyReactCompCrossOrigin')};

const SplatLink = withRouter(props => {
  const newProps = {to: props.to, className: props.className, style: props.style};
  if (props.location.pathname.indexOf(props.to) === 0) {
    newProps.style = {...props.style, ...props.activeStyle};
    newProps.className = `${props.className || ''} ${props.activeClassName || ''}`;
  }
  return <Link {...newProps}>{props.children}</Link>;
});
const Navigation = withStore(props => (
  <div>
    <EventsListener/>
    <input id="react-input" value={props.value} onChange={e => props.assign(e.target.value)}/>
    <br/>
    <SplatLink {...props} to="/ng-router-app/a" activeClassName={activeLink} className="nav">ng-router-app</SplatLink>&nbsp;
    <SplatLink {...props} to="/ui-router-app/" activeClassName={activeLink} className="nav">ui-router-app</SplatLink>&nbsp;
    <SplatLink {...props} to="/rt-router-app/" activeClassName={activeLink} className="nav">rt-router-app</SplatLink>&nbsp;
    <SplatLink {...props} to="/ng-router-app/b" activeClassName={activeLink} className="nav">ng-router-app</SplatLink>&nbsp;
    <SplatLink {...props} to="/ng-router-app4" activeClassName={activeLink} className="nav">ng-router-app4</SplatLink>&nbsp;
    <SplatLink {...props} to="/ng-router-app5" activeClassName={activeLink} className="nav">ng-router-app5</SplatLink>&nbsp;
    <SplatLink {...props} to="/ng-router-app5-no-unload-css" activeClassName={activeLink} className="nav">ng-router-app5-no-unload-css</SplatLink>&nbsp;
    <SplatLink {...props} to="/rt-router-app6" activeClassName={activeLink} className="nav">rt-router-app6</SplatLink>&nbsp;
    <div style={{marginTop: '15px'}}>{props.children}</div>
  </div>
));
Navigation.propTypes = {
  children: PropTypes.any
};

const Home = () => <span id="hello">hello</span>;

const App = withStore(withRouter(props => <MyApp.MyNgComp topology={topology} {...props}/>));
const App2 = withStore(withRouter(props => <MyApp2.MyNgComp topology={topology} {...props}/>));
const App3 = withStore(withRouter(props => <MyApp3.MyReactComp topology={topology} {...props}/>));
const App4 = withStore(withRouter(props => <MyApp4.MyNgComp topology={topology} {...props}/>));
const App5 = withStore(withRouter(props => <MyApp5.MyNgComp topology={topology} {...props}/>));
const App5NoUnloadModule = withStore(withRouter(props => <MyApp5NoUnloadCss.MyNgComp topology={topology} {...props}/>));
const App6 = withStore(withRouter(props => <MyApp6.MyReactCompCrossOrigin topology={topology} {...props}/>));

render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={Navigation}>
        <IndexRoute component={Home}/>
        <Route path="/ng-router-app/**" component={App}/>
        <Route path="/ui-router-app/**" component={App2}/>
        <Route path="/rt-router-app/**" component={App3}/>
        <Route path="/ng-router-app4" component={App4}/>
        <Route path="/ng-router-app5" component={App5}/>
        <Route path="/ng-router-app5-no-unload-css" component={App5NoUnloadModule}/>
        <Route path="/rt-router-app6" component={App6}/>
      </Route>
    </Router>
  </Provider>,
  rootElement
);
