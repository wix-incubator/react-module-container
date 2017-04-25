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


class ReactDialogHost extends React.Component {
  constructor() {
    super();
    this.state = {
      isOpen: false
    };
  }
  openDialog() {
    this.setState({
      isOpen: true
    });
  }
  closeDialog() {
    this.setState({
      isOpen: false
    });
  }
  render() {
    const Dialog = window.ModuleRegistry.component('RtDialog');
    return (
      <div>
        <h3>This is a react module that opens react dialog</h3>
        <button onClick={() => this.openDialog()}>Open React Dialog</button>
        <Dialog topology={this.props.topology} isOpen={this.state.isOpen} onClose={() => this.closeDialog()}/>
      </div>
    );
  }
}

ReactDialogHost.propTypes = {
  topology: React.PropTypes.any
};

window.ModuleRegistry.registerComponent('React.DialogHost', () => ReactDialogHost);
