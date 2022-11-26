function GET(req, res){
  res.json({text:'server is running'})
}

function OPTIONS(req, res){
  res.json({text:'server is running'})
}

function POST(req, res){
  res.json({text:'server is running'})
}

export{GET, OPTIONS, POST}
