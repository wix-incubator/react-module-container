process.env.FAKE_SERVER_PORT = 3100;

module.exports.config = {
  baseUrl: `http://localhost:${process.env.FAKE_SERVER_PORT}/`,

  onPrepare() {
    browser.ignoreSynchronization = true;
    require('./dist/test/mock/fake-server');
  }
};
