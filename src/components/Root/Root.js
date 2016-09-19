import React, {PropTypes} from 'react';
import Counter from '../Counter/Counter';
import {connect} from 'react-redux';
import {incrementCounter, decrementCounter} from '../../actions';

const Root = ({value, dispatch}) => {
  return (
    <Counter
      value={value}
      onIncrement={
        function () {
          dispatch(incrementCounter());
        }
      }
      onDecrement={
       function () {
         dispatch(decrementCounter());
       }
     }/>
  );
};

Root.propTypes = {
  dispatch: PropTypes.func,
  value: PropTypes.number
};

function mapStateToProps(state) {
  return {
    value: state
  };
}

export default connect(mapStateToProps)(Root);
