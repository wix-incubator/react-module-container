import React from 'react';
import Modal from 'react-modal';

class ReactDialog extends React.Component {
  render() {
    return (
      <Modal isOpen={this.props.isOpen} contentLabel="Modal">
        <div>
          {'Hello dialog'}
        </div>
        <button onClick={() => this.props.onClose && this.props.onClose()}>close</button>
      </Modal>
    );
  }
}

ReactDialog.propTypes = {
  isOpen: React.PropTypes.bool,
  onClose: React.PropTypes.func
};

window.ModuleRegistry.registerComponent('React.Dialog', () => ReactDialog);
