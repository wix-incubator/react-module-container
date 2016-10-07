const requireCache = {};
const styleSheets = document.styleSheets;

function noprotocol(url) {
  return url.replace(/^.*:\/\//, '//');
}

export function tagAppender(url, filetype) {
  return requireCache[url] = new Promise((resolve, reject) => {
    if (window.requirejs && filetype === 'js') {
      window.requirejs([url], resolve, reject);
      return;
    } else if (url in requireCache) {
      requireCache[url].then(resolve, reject);
      return;
    }

    let fileref;
    if (filetype === 'css') {
      fileref = document.createElement('LINK');
      fileref.setAttribute('rel', 'stylesheet');
      fileref.setAttribute('type', 'text/css');
      fileref.setAttribute('href', url);
    } else {
      fileref = document.createElement('SCRIPT');
      fileref.setAttribute('type', 'text/javascript');
      fileref.setAttribute('src', url);
    }

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

export function filesAppender(files) {
  return Promise.all(files.map(file => {
    return tagAppender(file, file.split('.').pop());
  }));
}
