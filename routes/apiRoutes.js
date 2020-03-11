var db = require("../db/db.json")
const fs = require('fs');
var path = require("path");

module.exports = function(app) {

  app.post("/api/notes", function(req, res) {

    console.log(JSON.stringify(req.body))
    fs.writeFileSync('./db/db.json', JSON.stringify(req.body));

    
  });

  app.get("/api/notes", function(req, res) {

 
    res.sendFile(path.join(__dirname, "../db/db.json"));

    // let savedNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    // res.json(savedNotes);
    
    
  });


};
