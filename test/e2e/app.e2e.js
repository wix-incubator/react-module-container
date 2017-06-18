'use strict';

describe('React application', () => {
  describe('life cycle events', () => {
    it('should not have navigation events', () => {
      browser.get('/');
      expect($('#got-start-loading').getText()).toBe('false');
      expect($('#got-component-ready').getText()).toBe('false');
    });

    it('should have navigation events', () => {
      browser.get('/ng-router-app4');
      expect($('#got-start-loading').getText()).toBe('true');
      expect($('#got-component-ready').getText()).toBe('true');
    });
  });

  describe('open page', () => {
    it('should display hello', () => {
      browser.get('/');
      expect($('#hello').getText()).toBe('hello');
    });

    it('should load/unload css files specified inside angular manifest', () => {

      browser.get('/ng-router-app4');
      expect(getStyleSheetHrefs()).toEqual([
        'http://localhost:3200/demo.css',
        'http://localhost:3200/demo-shared.css',
        'http://localhost:3200/demo-4.css'
      ]);

      expect($('.demo-shared').getCssValue('background-color')).toBe('rgba(200, 200, 200, 1)');
      expect($('.demo-4').getCssValue('color')).toBe('rgba(4, 4, 4, 1)');
      expectIsHidden('.demo-5');

      $$('.nav').get(5).click();
      expect(getStyleSheetHrefs()).toEqual([
        'http://localhost:3200/demo.css',
        'http://localhost:3200/demo-shared.css',
        'http://localhost:3200/demo-5.css'
      ]);

      expect($('.demo-shared').getCssValue('background-color')).toBe('rgba(200, 200, 200, 1)');
      expect($('.demo-5').getCssValue('color')).toBe('rgba(5, 5, 5, 1)');
      expectIsHidden('.demo-4');
    });

    ['ng', 'ui'].forEach((router, index) => describe(`/${router}-router-app/`, () => {
      it(`should display ${router} router app`, () => {
        browser.get(`/${router}-router-app/`);
        expect($('#value-in-angular').getText()).toBe('react-input-value');
        expect($(`${router}-view`).getText()).toBe('BAZINGA!');
        expect($('#value-in-react').getText()).toBe('angular-input-value');
        expect($('#counter').getText()).toBe('0');
      });

      it('should update inputs in nested apps', () => {
        browser.get(`/${router}-router-app/`);
        $('#counter').click();
        $('#angular-input').sendKeys('123');
        $('#react-input').sendKeys('123');
        expect($('#value-in-angular').getText()).toBe('react-input-value123');
        expect($('#value-in-react').getText()).toBe('angular-input-value123');
        expect($('#counter').getText()).toBe('1');
      });

      it('should support internal navigations', () => {
        browser.get(`/${router}-router-app/`);
        $('#counter').click();
        $('#angular-input').sendKeys('123');
        $('#react-input').sendKeys('123');
        $('#stagadish').click();
        expect($$('.nav').get(router === 'ng' ? 3 : 1).getCssValue('background-color')).toBe('rgba(255, 255, 0, 1)');
        expect($('#value-in-angular').getText()).toBe('react-input-value123');
        expect($('#value-in-react').getText()).toBe('angular-input-value123');
        expect($('#counter').getText()).toBe('1');
        expect($(`${router}-view`).getText()).toBe('STAGADISH!');
      });

      it('should be able to navigate from within nested app', () => {
        browser.get(`/${router}-router-app/a`);
        expect($$('.nav').get(index).getCssValue('background-color')).toBe('rgba(255, 255, 0, 1)');
        $('#react-app-link').click();
        expect($$('.nav').get(2).getCssValue('background-color')).toBe('rgba(255, 255, 0, 1)');
        $$('.react-link').get(index).click();
        expect($$('.nav').get(index).getCssValue('background-color')).toBe('rgba(255, 255, 0, 1)');
      });

      it('should be able to navigate from react embedded in angular', () => {
        browser.get(`/${router}-router-app/`);
        $('#react-input').sendKeys('123');
        $$('.react-link').get(index ? 0 : 1).click();
        expect($$('.nav').get(index ? 0 : 1).getCssValue('background-color')).toBe('rgba(255, 255, 0, 1)');
        expect($('#value-in-angular').getText()).toBe('react-input-value123');
      });
    }));
  });

  function getStyleSheetHrefs() {
    return $$('link').map(elem => elem.getAttribute('href'));
  }

  function expectIsHidden(selector) {
    expect($(selector).getCssValue('color')).toBe('rgba(0, 0, 0, 0)');
    expect($(selector).getCssValue('display')).toBe('none');
  }

});
