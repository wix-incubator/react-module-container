import chai from 'chai';
import counter from './index';

const expect = chai.expect;

describe('reducers', () => {
  describe('counter', () => {
    it('should provide the initial state', () => {
      expect(counter(undefined, {})).to.eql(0);
    });
    it('should increment counter', () => {
      expect(counter(0, {type: 'INCREMENT'})).to.eql(1);
    });
    it('should decrement counter', () => {
      expect(counter(2, {type: 'DECREMENT'})).to.eql(1);
    });
  });
});
