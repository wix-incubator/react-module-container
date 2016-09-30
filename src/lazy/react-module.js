import React from 'react';
import {Link} from 'react-router';

const RealReactComp = props => (
  <div>
    <span>{props.value}</span>
    <div>
      <Link className={'react-link'} to="/ng-router-app/">ng-route-app</Link>
      <Link className={'react-link'} to="/ui-router-app/">ui-route-app</Link>
    </div>
  </div>
);
RealReactComp.propTypes = {
  value: React.PropTypes.any
};
window.ModuleRegistry.registerComponent('MyApp3.RealReactComp', () => RealReactComp);
