var express = require("express");
var app = express();

app.use(express.static(__dirname + "/public"));

app.get("/", (req,res,err)=>{
  if(err){
    retur err;
  }
  res.send(req.params);
});

app.listen(8080);
console.log("listening on port "+ 8080);
