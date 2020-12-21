import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', 0);
  return next();
});

app.use('*', (req, res) => {
  res.sendFile(path.join(process.cwd(), './src/index.html'));
});

const port = process.env.FAKE_SERVER_PORT || 3000;
app.listen(port, () => {
  console.log(`Fake server is running on port ${port}`);
});

module.exports = app;
