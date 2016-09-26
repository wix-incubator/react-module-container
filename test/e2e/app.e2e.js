'use strict';

describe('React application', () => {
  describe('open page', () => {
    it('should display hello', () => {
      browser.get('/');
      expect($('span').getText()).toBe('hello');
    });

    it('should display count', () => {
      browser.get('/my-app/');
      expect($('span').getText()).toBe('hi shahata 5!!!');
    });
  });
});
