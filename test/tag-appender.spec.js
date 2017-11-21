import 'mocha';
import {expect} from 'chai';
import {unloadStyles, createLinkElement} from '../src/tag-appender';

describe('tag appender', () => {

  before(function () {
    this.jsdom = require('jsdom-global')();
  });

  after(function () {
    this.jsdom();
  });

  it('should unload css in the right order', () => {
    const cssUrl = 'http://example.com/test.css';
    const css1 = createLinkElement(cssUrl);
    const css2 = createLinkElement(cssUrl);

    const headElement = document.getElementsByTagName('head')[0];
    headElement.appendChild(css1);
    headElement.appendChild(css2);

    unloadStyles(document, [cssUrl]);

    expect(document.getElementsByTagName('link').length).to.equal(1);
    expect(document.getElementsByTagName('link')[0]).to.equal(css2);
  });
});
