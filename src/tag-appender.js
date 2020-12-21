import ModuleRegistry from './module-registry';
import {FileAppenderLoadError} from './ReactModuleContainerErrors';

const requireCache = {};

function noprotocol(url) {
  return url.replace(/^.*:\/\//, '//');
}

export function createLinkElement(url) {
  const fileref = document.createElement('LINK');
  fileref.setAttribute('rel', 'stylesheet');
  fileref.setAttribute('type', 'text/css');
  fileref.setAttribute('href', url);
  return fileref;
}

export function createScriptElement(url, crossorigin) {
  const fileref = document.createElement('SCRIPT');
  fileref.setAttribute('type', 'text/javascript');
  fileref.setAttribute('src', url);
  if (crossorigin) {
    fileref.setAttribute('crossorigin', 'anonymous');
  }
  return fileref;
}

export function tagAppender(url, filetype, crossorigin) {
  const styleSheets = document.styleSheets;
  return requireCache[url] = new Promise((resolve, reject) => {
    if (window.requirejs && filetype === 'js') {
      window.requirejs([url], resolve, reject);
      return;
    } else if (url in requireCache) {
      // requireCache[url].then(resolve, reject);
      // return;
    }

    const fileref = (filetype === 'css') ?
      createLinkElement(url) :
      createScriptElement(url, crossorigin);

    let done = false;
    document.getElementsByTagName('head')[0].appendChild(fileref);
    fileref.onerror = function () {
      fileref.onerror = fileref.onload = fileref.onreadystatechange = null;
      delete requireCache[url];
      ModuleRegistry.notifyListeners('reactModuleContainer.error', new FileAppenderLoadError(url));
      reject(new Error(`Could not load URL ${url}`));
    };
    fileref.onload = fileref.onreadystatechange = function () {
      if (!done && (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete')) {
        done = true;
        fileref.onerror = fileref.onload = fileref.onreadystatechange = null;
        resolve();
      }
    };
    if (filetype === 'css' && navigator.userAgent.match(' Safari/') && !navigator.userAgent.match(' Chrom') && navigator.userAgent.match(' Version/5.')) {
      let attempts = 20;
      const interval = setInterval(() => {
        for (let i = 0; i < styleSheets.length; i++) {
          if (noprotocol(`${styleSheets[i].href}`) === noprotocol(url)) {
            clearInterval(interval);
            fileref.onload();
            return;
          }
        }
        if (--attempts === 0) {
          clearInterval(interval);
          fileref.onerror();
        }
      }, 50);
    }
  });
}

function append(file, crossorigin) {
  return tagAppender(file, file.split('.').pop(), crossorigin);
}

function onCatch(error, optional = false) {
  return optional ? Promise.resolve() : Promise.reject(error);
}

function appendEntry(entry, crossorigin) {
  if (typeof entry === 'object') {
    const {optional, url} = entry;
    return append(url, crossorigin).catch(err => onCatch(err, optional));
  } else {
    return append(entry, crossorigin).catch(err => onCatch(err));
  }
}

export function filesAppender(entries, crossorigin) {
  return Promise.all(entries.map(entry => {
    if (Array.isArray(entry)) {
      return entry.reduce(
        (promise, entry) => promise.then(() => appendEntry(entry, crossorigin)),
        Promise.resolve());
    } else {
      return appendEntry(entry, crossorigin);
    }
  }));
}

const getStyleSheetLinks = document =>
  Array.from(document.querySelectorAll('link'))
    .filter(link => link.rel === 'stylesheet' && link.href)
    .reduceRight((acc, curr) => ({...acc, [noprotocol(curr.href)]: curr}), {});

const toUrlString = file => typeof file === 'object' ? file.url : file;

const getStyleSheetUrls = files =>
  [].concat(...files)
    .map(toUrlString)
    .filter(url => url.endsWith('.css'))
    .map(noprotocol);

export function unloadStyles(document, files) {
  const links = getStyleSheetLinks(document);
  getStyleSheetUrls(files).forEach(file => {
    const link = links[file];
    if (link) {
      link.parentNode.removeChild(link);
    }
  });
}
