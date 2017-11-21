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

export function createScriptElement(url) {
  const fileref = document.createElement('SCRIPT');
  fileref.setAttribute('type', 'text/javascript');
  fileref.setAttribute('src', url);
  return fileref;
}

export function tagAppender(url, filetype) {
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
      createScriptElement(url);

    let done = false;
    document.getElementsByTagName('head')[0].appendChild(fileref);
    fileref.onerror = function () {
      fileref.onerror = fileref.onload = fileref.onreadystatechange = null;
      delete requireCache[url];
      reject();
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

function append(file) {
  return tagAppender(file, file.split('.').pop());
}

export function filesAppender(files) {
  return Promise.all(files.map(file => {
    if (Array.isArray(file)) {
      return file.reduce((promise, next) => promise.then(() => append(next), err => console.log(err)), Promise.resolve());
    } else {
      return append(file);
    }
  }));
}

const getStyleSheetLinks = document =>
  [...document.querySelectorAll('link')]
    .filter(link => link.rel === 'stylesheet' && link.href)
    .reduceRight((acc, curr) => ({...acc, [noprotocol(curr.href)]: curr}), {});

const getStyleSheetUrls = files =>
  [].concat(...files).filter(file => file.endsWith('.css')).map(file => noprotocol(file));

export function unloadStyles(document, files) {
  const links = getStyleSheetLinks(document);
  getStyleSheetUrls(files).forEach(file => {
    const link = links[file];
    if (link) {
      link.parentNode.removeChild(link);
    }
  });
}
