'use strict';

describe('React application', () => {
  describe('open page', () => {
    it('should display count', () => {
      browser.get('/');
      expect($('span').getText()).toBe('hi shahata 5!!!');
    });
  });
});
