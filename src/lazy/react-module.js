import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router';
import ModuleRegistry from '../module-registry';

const RealReactComp = props => (
  <div>
    <div>{props.value}</div>
    <div id="value-of-resolved-experiments">{JSON.stringify(props.experiments)}</div>
    <div id="value-of-resolved-custom-data">{JSON.stringify(props.customData)}</div>
    <div>
      <Link className={'react-link'} to="/ng-router-app/a">ng-route-app</Link>&nbsp;
      <Link className={'react-link'} to="/ui-router-app/">ui-route-app</Link>&nbsp;
    </div>
  </div>
);
RealReactComp.propTypes = {
  value: PropTypes.any,
  experiments: PropTypes.any,
  customData: PropTypes.any
};
ModuleRegistry.registerComponent('MyApp3.RealReactComp', () => RealReactComp);

const RealReactCompCrossOrigin = props => (
  <div>
    <div id="react-cross-origin">{props.value}</div>
  </div>
);
RealReactCompCrossOrigin.propTypes = {
  value: PropTypes.any
};
ModuleRegistry.registerComponent('MyApp6.RealReactCompCrossOrigin', () => RealReactCompCrossOrigin);

const DemoReactComp = () => (
  <div className="demo-shared">
    <div className="demo-4">demo-4</div>
    <div className="demo-5">demo-5</div>
  </div>
);
ModuleRegistry.registerComponent('MyApp7.RealReactComp', () => DemoReactComp);
