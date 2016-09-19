'use strict';

import path from 'path';
import requireReload from 'require-reload';
import {Engine} from 'velocity';
const reload = requireReload(require);

function renderVM(urlPath) {
  const htmlRE = /\.html$/i;
  const notFile = !(/\.[a-z0-9]+$/i).test(urlPath);
  const isHtml = htmlRE.test(urlPath);
  const filePath = notFile ? 'index.vm' : urlPath.replace(htmlRE, '.vm');
  const fullPath = path.resolve(filePath);
  const useRenderer = !(notFile || isHtml);
  return useRenderer ? renderVMEngine(fullPath) : null;
}

function renderVMEngine(template) {
  const engine = new Engine({template});

  let velocityData, velocityDataPrivate;
  try {
    velocityData = reload(`${process.cwd()}/velocity.data.js`);
  } catch (e) {
    velocityData = {};
  }
  try {
    velocityDataPrivate = reload(`${process.cwd()}/velocity.private.data.js`);
  } catch (e) {
    velocityDataPrivate = {};
  }
  return engine.render(Object.assign({}, velocityData, velocityDataPrivate));
}

module.exports.renderVM = renderVM;
