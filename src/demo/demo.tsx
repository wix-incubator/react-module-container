import React from 'react';
import PropTypes from 'prop-types';
import {render} from 'react-dom';
import {createStore, Reducer} from 'redux';
import {Provider, connect} from 'react-redux';
import ModuleRegistry from '../module-registry';
import {EventsListener} from './EventListener';
import {Router, Route, browserHistory, Link, IndexRoute, withRouter} from 'react-router';
import s from './demo.scss';

const assignActionCreator = (value: string) => ({
 type: 'assign' as const,
 value
})

const reducer: Reducer<string> = (state = 'react-input-value', action) => {
  return action.type === 'assign' ? action.value : state;
};
const store = createStore(reducer);

const withStore = connect(
  (state: string) => ({value: state}),
  dispatch => ({assign: (value: string) => dispatch(assignActionCreator(value))})
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
const MyApp7 = {MyReactComp: ModuleRegistry.component('MyApp7.MyReactComp')};
const MyApp8 = {MyReactComp: ModuleRegistry.component('MyApp8.MyReactComp')};

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
    <SplatLink {...props} to="/ng-router-app/a" activeClassName={s.activeLink} className="nav">ng-router-app</SplatLink>&nbsp;
    <SplatLink {...props} to="/ui-router-app/" activeClassName={s.activeLink} className="nav">ui-router-app</SplatLink>&nbsp;
    <SplatLink {...props} to="/rt-router-app/" activeClassName={s.activeLink} className="nav">rt-router-app</SplatLink>&nbsp;
    <SplatLink {...props} to="/ng-router-app/b" activeClassName={s.activeLink} className="nav">ng-router-app</SplatLink>&nbsp;
    <SplatLink {...props} to="/ng-router-app4" activeClassName={s.activeLink} className="nav">ng-router-app4</SplatLink>&nbsp;
    <SplatLink {...props} to="/ng-router-app5" activeClassName={s.activeLink} className="nav">ng-router-app5</SplatLink>&nbsp;
    <SplatLink {...props} to="/ng-router-app5-no-unload-css" activeClassName={s.activeLink} className="nav">ng-router-app5-no-unload-css</SplatLink>&nbsp;
    <SplatLink {...props} to="/rt-router-app6" activeClassName={s.activeLink} className="nav">rt-router-app6</SplatLink>&nbsp;
    <SplatLink {...props} to="/rt-router-app7" activeClassName={s.activeLink} className="nav">rt-router-app7</SplatLink>&nbsp;
    <SplatLink {...props} to="/rt-router-app8" activeClassName={s.activeLink} className="nav">rt-router-app8</SplatLink>&nbsp;
    <div style={{marginTop: '15px'}}>{props.children}</div>
  </div>
));
Navigation.propTypes = {
  children: PropTypes.any
};

const Home = () => <span id="hello">hello</span>;

const App = withStore(withRouter(props => MyApp.MyNgComp ? <MyApp.MyNgComp topology={topology} {...props}/> : null));
const App2 = withStore(withRouter(props => MyApp2.MyNgComp ? <MyApp2.MyNgComp topology={topology} {...props}/> : null));
const App3 = withStore(withRouter(props => MyApp3.MyReactComp ? <MyApp3.MyReactComp topology={topology} {...props}/> : null));
const App4 = withStore(withRouter(props => MyApp4.MyNgComp ? <MyApp4.MyNgComp topology={topology} {...props}/> : null));
const App5 = withStore(withRouter(props => MyApp5.MyNgComp? <MyApp5.MyNgComp topology={topology} {...props}/> : null));
const App5NoUnloadModule = withStore(withRouter(props => MyApp5NoUnloadCss.MyNgComp ? <MyApp5NoUnloadCss.MyNgComp topology={topology} {...props}/> : null));
const App6 = withStore(withRouter(props => MyApp6.MyReactCompCrossOrigin ? <MyApp6.MyReactCompCrossOrigin topology={topology} {...props}/> : null));
const App7 = withStore(withRouter(props => MyApp7.MyReactComp ? <MyApp7.MyReactComp topology={topology} {...props}/> : null));
const App8 = withStore(withRouter(props => MyApp8.MyReactComp ? <MyApp8.MyReactComp topology={topology} {...props}/> : null));

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
        <Route path="/rt-router-app7" component={App7}/>
        <Route path="/rt-router-app8" component={App8}/>
      </Route>
    </Router>
  </Provider>,
  rootElement
);
