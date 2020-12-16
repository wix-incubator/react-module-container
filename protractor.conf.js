process.env.FAKE_SERVER_PORT = 3100;

module.exports.config = {
  // specs: ['dist/test/**/*.e2e.js'],
  baseUrl: `http://localhost:${process.env.FAKE_SERVER_PORT}/`,

  onPrepare() {
    browser.ignoreSynchronization = true;
    require('./dist/test/mock/fake-server');
  }
};
