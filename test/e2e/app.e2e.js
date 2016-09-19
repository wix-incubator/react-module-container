'use strict';

describe('React application', () => {
  describe('open page', () => {
    it('should display count', () => {
      browser.get('/');
      expect($('p').getText()).toBe('0');
    });
  });
});
