import React from 'react';
import {Link} from 'react-router';

const RealReactComp = props => (
  <div>
    <span>{props.value}</span>
    <div>
      <Link className={'react-link'} to="/ng-router-app/a">ng-route-app</Link>&nbsp;
      <Link className={'react-link'} to="/ui-router-app/">ui-route-app</Link>&nbsp;
    </div>
  </div>
);
RealReactComp.propTypes = {
  value: React.PropTypes.any
};
window.ModuleRegistry.registerComponent('MyApp3.RealReactComp', () => RealReactComp);
