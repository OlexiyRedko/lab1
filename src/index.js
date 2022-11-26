import router from './router.js'
import defaultHandler from './defaultHandler.js'
// import helpers from './helpers.js';
// import safeJSON from './utils.js';
import * as http from 'node:http'

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || '/', `https://${req.headers.host}`)
  const routerModule = router.get(url.pathname) ?? {}
  const handler = routerModule[req?.method] ?? defaultHandler

  handler(req, res)
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
