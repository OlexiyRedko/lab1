import server from "../src/server.js";

export default function handler(req, res) {
  // server(req, res)
  const { name = 'World' } = req.query
  return res.send(`Hello ${name}!`)
}
