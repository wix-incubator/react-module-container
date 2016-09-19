import jsdom from 'jsdom';

function setupDom() {
  const baseMarkup = '<!DOCTYPE html><html><head><title></title></head><body></body></html>';
  const window = jsdom.jsdom(baseMarkup).defaultView;

  global.window = window;
  global.document = window.document;
  global.navigator = window.navigator;
}

export default setupDom;
