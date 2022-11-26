function GET(req, res, url, payload) {
  res.json({ text: 'GET' });
}

function OPTIONS(req, res) {
  res.json({ text: 'OPTIONS' });
}

function POST(req, res, url, payload) {
  res.json({ contentType: req.headers['content-type'], payload });
}

export { GET, OPTIONS, POST };
