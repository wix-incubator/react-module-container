import ModuleRegistry from './module-registry';
import {FileAppenderLoadError} from './ReactModuleContainerErrors';
import {FileConfig} from './typings';

const requireCache: {[url: string]: Promise<unknown>} = {};

function noprotocol(url: string) {
  return url.replace(/^.*:\/\//, '//');
}

export function createLinkElement(url: string) {
  const fileref = document.createElement('LINK') as HTMLLinkElement;
  fileref.setAttribute('rel', 'stylesheet');
  fileref.setAttribute('type', 'text/css');
  fileref.setAttribute('href', url);
  return fileref;
}

export function createScriptElement(url: string, crossorigin?: boolean) {
  const fileref = document.createElement('SCRIPT') as HTMLScriptElement;
  fileref.setAttribute('type', 'text/javascript');
  fileref.setAttribute('src', url);
  if (crossorigin) {
    fileref.setAttribute('crossorigin', 'anonymous');
  }
  return fileref;
}

export function tagAppender(url: string, filetype?: string, crossorigin?: boolean) {
  const styleSheets = document.styleSheets;
  return requireCache[url] = new Promise((resolve, reject) => {
    if (window.requirejs && filetype === 'js') {
      window.requirejs([url], resolve, reject);
      return;
    } else if (url in requireCache) {
      // requireCache[url].then(resolve, reject);
      // return;
    }

    type FileRef = (HTMLLinkElement | HTMLScriptElement) & {onreadystatechange: unknown, readyState: string};
    const fileref = ((filetype === 'css') ?
      createLinkElement(url) :
      createScriptElement(url, crossorigin)) as FileRef;

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
            // @ts-ignore
            fileref.onload();
            return;
          }
        }
        if (--attempts === 0) {
          clearInterval(interval);
          // @ts-ignore
          fileref.onerror();
        }
      }, 50);
    }
  });
}

function append(file: string, crossorigin?: boolean) {
  return tagAppender(file, file.split('.').pop(), crossorigin);
}

function onCatch(error: Error, optional = false) {
  return optional ? Promise.resolve() : Promise.reject(error);
}

function appendEntry(entry: string | FileConfig, crossorigin?: boolean) {
  if (typeof entry === 'object') {
    const {optional, url} = entry;
    return append(url, crossorigin).catch(err => onCatch(err, optional));
  } else {
    return append(entry, crossorigin).catch(err => onCatch(err));
  }
}

export function filesAppender(entries: (string | FileConfig)[] = [], crossorigin?: boolean) {
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

const getStyleSheetLinks = (document: Document) =>
  [...document.querySelectorAll('link')]
    .filter(link => link.rel === 'stylesheet' && link.href)
    .reduceRight((acc, curr) => ({...acc, [noprotocol(curr.href)]: curr}), {} as {[link: string]: HTMLLinkElement});

const toUrlString = (file: string | FileConfig) => typeof file === 'object' ? file.url : file;

const getStyleSheetUrls = (files: (string | FileConfig)[] = []) =>
  files
    .map(toUrlString)
    .filter(url => url.endsWith('.css'))
    .map(noprotocol);

export function unloadStyles(document: Document, files?: (string | FileConfig)[]) {
  const links = getStyleSheetLinks(document);
  getStyleSheetUrls(files).forEach(file => {
    const link = links[file];
    if (link) {
      link.parentNode?.removeChild(link);
    }
  });
}
