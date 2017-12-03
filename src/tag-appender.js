const requireCache = {};

function getUrlWithoutProtocol(url) {
  return url.replace(/^.*:\/\//, '//');
}

function createElement(type, attributes) {
  const resourceTag = document.createElement(type);

  Object.entries(attributes).forEach(([key, value]) => {
    resourceTag.setAttribute(key, value);
  });

  return resourceTag;
}

export function createLinkElement(url) {
  return createElement('link', {
    rel: 'stylesheet',
    type: 'text/css',
    href: url
  });
}

export function createScriptElement(url) {
  return createElement('script', {
    type: 'text/javascript',
    src: url
  });
}

export function appendTag(url, fileType) {
  const styleSheets = document.styleSheets;
  const isCssResource = fileType === 'css';
  const isJSResource = fileType === 'js';

  return requireCache[url] = new Promise((resolve, reject) => {
    const requireJs = window.requirejs;
    if (requireJs && isJSResource) {
      requireJs([url], resolve, reject);
      return;
    } else if (url in requireCache) {
      // requireCache[url].then(resolve, reject);
      // return;
    }

    const resourceRef = isCssResource ?
      createLinkElement(url) :
      createScriptElement(url);

    resourceRef.onerror = function () {
      resourceRef.onerror = resourceRef.onload = resourceRef.onreadystatechange = null;
      delete requireCache[url];
      reject();
    };
    resourceRef.onload = resourceRef.onreadystatechange = function () {
      if (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete') {
        resourceRef.onerror = resourceRef.onload = resourceRef.onreadystatechange = null;
        resolve();
      }
    };

    document.getElementsByTagName('head')[0].appendChild(resourceRef);

    const isSafariBrowser = navigator.userAgent.match(' Safari/');
    const isChromeFamilyBrowser = navigator.userAgent.match(' Chrom');
    const isOldVersionBrowser = navigator.userAgent.match(' Version/5.');

    if (isCssResource && isSafariBrowser && !isChromeFamilyBrowser && isOldVersionBrowser) {
      let attempts = 20;

      const fileLoadedCheckIntervalId = setInterval(() => {
        for (let i = 0; i < styleSheets.length; i++) {
          if (getUrlWithoutProtocol(styleSheets[i].href) === getUrlWithoutProtocol(url)) {
            clearInterval(fileLoadedCheckIntervalId);
            resourceRef.onload();
            return;
          }
        }

        attempts--;

        if (attempts === 0) {
          clearInterval(fileLoadedCheckIntervalId);
          resourceRef.onerror();
        }
      }, 50);
    }
  });
}

function append(file) {
  return appendTag(file, file.split('.').pop());
}

export function filesAppender(files) {
  return Promise.all(files.map(file => {
    if (Array.isArray(file)) {
      return file.reduce(
        (promise, next) => promise.then(
          () => append(next),
          err => console.log(err)
        ),
        Promise.resolve()
      );
    } else {
      return append(file);
    }
  }));
}

const getStyleSheetLinks = document =>
  [...document.querySelectorAll('link')]
    .filter(link => link.rel === 'stylesheet' && link.href)
    .reduceRight((acc, curr) => ({...acc, [getUrlWithoutProtocol(curr.href)]: curr}), {});

const getStyleSheetUrls = urls =>
  [...urls].filter(url => url.endsWith('.css')).map(file => getUrlWithoutProtocol(file));

export function unloadStyles(document, files) {
  const cssLinks = getStyleSheetLinks(document);
  const urls = getStyleSheetUrls(files);

  urls.forEach(url => {
    const link = cssLinks[url];
    if (link) {
      link.parentNode.removeChild(link);
    }
  });
}
