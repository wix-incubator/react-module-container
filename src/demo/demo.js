import React from 'react';
import {render} from 'react-dom';
import {createStore} from 'redux';
import {Provider, connect} from 'react-redux';
import ModuleRegistry from '../module-registry';
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

const SplatLink = withRouter(props => {
  const newProps = {to: props.to, className: props.className, style: props.style};
  if (props.location.pathname.indexOf(props.to) === 0) {
    newProps.style = {...props.style, ...props.activeStyle};
    newProps.className = `${props.className || ''} ${props.activeClassName || ''}`;
  }
  return <Link {...newProps}>{props.children}</Link>;
});
class EventsListener extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gotStartLoadingEvent: false,
      gotComponentReady: false,
      gotComponentWillUnmount: false
    };
  }

  componentWillMount() {
    if (this.unSubscribeStartLoading) {
      this.unSubscribeStartLoading();
    }
    this.unSubscribeStartLoading = window.ModuleRegistry.addListener('react-module-container.componentStartLoading', () => {
      this.setState({gotStartLoadingEvent: true});
    });

    if (this.unSubscribeComponentReady) {
      this.unSubscribeComponentReady();
    }
    this.unSubscribeComponentReady = window.ModuleRegistry.addListener('react-module-container.componentReady', () => {
      this.setState({gotComponentReady: true});
    });

    if (this.unSubscribeComponentWillUnmount) {
      this.unSubscribeComponentWillUnmount();
    }
    this.unSubscribeComponentWillUnmount = window.ModuleRegistry.addListener('react-module-container.componentWillUnmount', () => {
      this.setState({gotComponentWillUnmount: true});
    });
  }

  componentWillUnmount() {
    if (this.unSubscribeStartLoading) {
      this.unSubscribeStartLoading.remove();
      this.unSubscribeStartLoading = null;
    }
    if (this.unSubscribeComponentReady) {
      this.unSubscribeComponentReady.remove();
      this.unSubscribeComponentReady = null;
    }
    if (this.unSubscribeComponentWillUnmount) {
      this.unSubscribeComponentWillUnmount.remove();
      this.unSubscribeComponentWillUnmount = null;
    }
  }

  render() {
    return (<div>
      <div>gotStartLoadingEvent: <span id="got-start-loading">{this.state.gotStartLoadingEvent ? 'true' : 'false'}</span></div>
      <div>gotComponentReady: <span id="got-component-ready">{this.state.gotComponentReady ? 'true' : 'false'}</span></div>
      <div>gotComponentWillUnmount: <span id="got-component-will-unmount">{this.state.gotComponentWillUnmount ? 'true' : 'false'}</span></div>
    </div>);
  }
}

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
    <div style={{marginTop: '15px'}}>{props.children}</div>
  </div>
));
Navigation.propTypes = {
  children: React.PropTypes.any
};

const Home = () => <span id="hello">hello</span>;

const App = withStore(withRouter(props => <MyApp.MyNgComp topology={topology} {...props}/>));
const App2 = withStore(withRouter(props => <MyApp2.MyNgComp topology={topology} {...props}/>));
const App3 = withStore(withRouter(props => <MyApp3.MyReactComp topology={topology} {...props}/>));
const App4 = withStore(withRouter(props => <MyApp4.MyNgComp topology={topology} {...props}/>));
const App5 = withStore(withRouter(props => <MyApp5.MyNgComp topology={topology} {...props}/>));
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
      </Route>
    </Router>
  </Provider>,
  rootElement
);
