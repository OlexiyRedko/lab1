function GET(req, res){
  res.json({text:'thats route2 GET'})
}

function OPTIONS(req, res){
  res.json({text:'thats route2 OPTIONS'})
}

function POST(req, res){
  res.json({text:'thats route2 POST'})
}

export{GET, OPTIONS, POST}
