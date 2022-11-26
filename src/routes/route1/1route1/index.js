function GET(req, res){
  res.json({text:'thats 1route1 GET'})
}

function OPTIONS(req, res){
  res.json({text:'thats 1route1 OPTIONS'})
}

function POST(req, res){
  res.json({text:'thats 1route1 POST'})
}

export{GET, OPTIONS, POST}
