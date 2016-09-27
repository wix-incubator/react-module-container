import React from 'react';
import {Link} from 'react-router';

const RealReactComp = props => (
  <div>
    <span>woot {props.value}</span>
    <div><Link to="/my-app/">my app</Link></div>
  </div>
);
RealReactComp.propTypes = {
  value: React.PropTypes.any
};
window.ModuleRegistry.registerComponent('MyApp3.RealReactComp', () => RealReactComp);
