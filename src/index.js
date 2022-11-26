import router from './router.js'
import defaultHandler from './defaultHandler.js'
import safeJSON from './utils.js'
import * as http from 'node:http'
import helpers from './helpers.js'

const processedContentTypes = {
  'text/html': (text) => text,
  'text/plain': (text) => text,
  'application/json': (json) => safeJSON(json, {}),
  'x-www-form-urlencoded': (data) => {
    return Object.fromEntries(new URLSearchParams(data))
  },
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || '/', `https://${req.headers.host}`)
  const routerModule = router.get(url.pathname) ?? {}
  const handler = routerModule[req?.method] ?? defaultHandler

  let payload = {}
  let rawRequest = ''

  for await (const chunk of req) {
    rawRequest += chunk
  }

  if (req.headers['content-type']) {
    const contentType = req.headers['content-type'].split(';')[0]
    if (processedContentTypes[contentType]) {
      payload = processedContentTypes[contentType](rawRequest)
    }
  }

  try {
    handler(req, Object.assign(res, helpers), url, payload, rawRequest)
  } catch (e) {
    res.statusCode = 500
    res.end(process.env.NODE_ENV === 'production' ? 'internal error' : e)
  }
})

server.listen(parseInt(process.env.PORT) || 8000)

server.on('clientError', (err, socket) => {
  console.log(err)
  socket.end('HTTP/1.1 400 badrequest \r\n\r\n')
})

process.on('SIGINT', () => {
  server.close((error) => {
    if (error) {
      console.log(error)
      process.exit(1)
    }
  })
})

// export default function handler(req, res) {
//   const { name = 'World' } = req.query
//   return res.send(`Hello ${name}!`)
// }
