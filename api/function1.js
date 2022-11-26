import server from "../src/server.js";

export default function handler(req, res) {
  // server(req, res)
  return res.send(`Hello ${name}!`)
}
