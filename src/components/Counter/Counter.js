import React, {PropTypes} from 'react';
import './Counter.scss';

const Counter = ({value, onIncrement, onDecrement}) => {
  return (
    <div>
      <p className="main-color">{value}</p>
      <button className="increment-button" onClick={onIncrement}>+</button>
      <button className="decrement-button" onClick={onDecrement}>-</button>
    </div>
  );
};

Counter.propTypes = {
  value: PropTypes.number,
  onIncrement: PropTypes.func,
  onDecrement: PropTypes.func
};

export default Counter;
