import defaultHandler from './defaultHandler.js';
import router from './router.js';
import * as http from 'node:http';
import helpers from './helpers.js';
import safeJSON from './utils.js';

const processedContentTypes = {
  'text/html': (text) => text,
  'text/plain': (text) => text,
  'application/json': (json) => safeJSON(json, {}),
  'x-www-form-urlencoded': (data) => {
    return Object.fromEntries(new URLSearchParams(data));
  },
};

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || '/', `https://${req.headers.host}`);
  const routerModule = router.get(url.pathname) ?? {};
  const handler = routerModule[req?.method] ?? defaultHandler;

  let payload = {};
  let rawRequest = '';

  for await (const chunk of req) {
    rawRequest += chunk;
  }

  if (req.headers['content-type']) {
    const contentType = req.headers['content-type'].split(';')[0];
    if (processedContentTypes[contentType]) {
      payload = processedContentTypes[contentType](rawRequest);
    }
  }

  try {
    handler(req, Object.assign(res, helpers), url, payload, rawRequest);
  } catch (e) {
    res.statusCode = 500;
    res.end(process.env.NODE_ENV === 'production' ? 'internal error' : e);
  }
});

server.on('clientError', (err, socket) => {
  if (err) {
    console.log(err.stack);
  }
  socket.end('HTTP/1.1 400 bad request\r\n\r\n');
});
server.listen(parseInt(process.env.PORT) || 8000);

process.on('SIGINT', () => {
  server.close((error) => {
    if (error) {
      console.error(error);
      process.exit(1);
    }
  });
});

export default server
