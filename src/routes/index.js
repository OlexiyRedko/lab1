function GET(req, res) {
  res.json({ text: 'server is running GET' })
}

function OPTIONS(req, res) {
  res.json({ text: 'server is running OPTIONS' })
}

function POST(req, res) {
  res.json({ text: 'server is running POST' })
}

export { GET, OPTIONS, POST }
