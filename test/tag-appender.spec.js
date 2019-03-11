import 'mocha';
import {expect} from 'chai';
import {unloadStyles, createLinkElement, filesAppender} from '../src/tag-appender';

describe('tag appender', () => {

  beforeEach(function () {
    this.jsdom = require('jsdom-global')();
  });

  afterEach(function () {
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

  it('filesAppender should set optional flag to false by default', done => {
    const link1 = {url: 'http://123.js/'};
    const link2 = {url: 'http://456.js/'};

    filesAppender([link1, link2]).catch(() => done());
    setTimeout(() => {
      document.getElementsByTagName('script')[0].onerror();
    }, 100);
  }).timeout(1000);

  it('filesAppender should support optional flag', done => {
    const link1 = {url: 'http://123.js/', optional: true};
    const link2 = {url: 'http://456.js/', optional: true};

    filesAppender([link1, link2]).then(() => done());

    setTimeout(() => {
      document.getElementsByTagName('script')[0].onerror();
      document.getElementsByTagName('script')[1].onerror();
    }, 100);
  }).timeout(1000);

});
