const express = require("express");
const fs = require("fs");
const path = require("path");
var compression = require('compression');

var app = express();

var PORT = process.env.PORT || 8080;

app.use(compression());
app.use(express.urlencoded({ extended: true}));
app.use(express.json());

//setting variables to keep track of ID's and hold db.json values in array
var NoteID = 0;
var notesArray = [];

//reads db file for notes section
fs.readFile(path.join(__dirname, "/db/db.json"), function (err, data){
    if(err){
        console.log(err);
    }
    else{
        notesArray = JSON.parse(data) ;
    }
})


//HTML Routes
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "public/index.html"));
})

app.get("/notes", function (req, res){
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});

//API Routes
app.get("/api/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "db/db.json"));
});

//setting static directory for assets
app.use('', express.static(__dirname + '/public'));

//create note
app.post("/api/notes", function (req, res){
    var postedNote = req.body;
    
    notesArray.forEach(function (note) {
        if (note.id === NoteID) {
            NoteID++
        }
    })

    postedNote.id = NoteID;
    console.log(postedNote);
    notesArray.push(postedNote);
    var noteArrayString = JSON.stringify(notesArray)
    fs.writeFile(path.join(__dirname, "db/db.json"), noteArrayString, function (error) {
        if (error) { console.log(error) }
    })
    res.json(notesArray)
})
//delete note
app.delete("/api/notes/:id", function (req, res) {

    var selectedID = req.params.id;

    for (let i = 0; i < notesArray.length; i++) {
        if (notesArray[i].id === parseInt(selectedID)) {
            notesArray.splice([i], 1);
            var noteArrayString = JSON.stringify(notesArray)
            fs.writeFile(path.join(__dirname, "db/db.json"), noteArrayString, function (error) {
                if (error) { console.log(error) }
            })

            app.get("/notes", function (req, res){
                res.sendFile(path.join(__dirname, "/public/notes.html"));
            });

        }
    }


});


app.listen(PORT, function(){
    console.log("App listening on PORT: " + PORT);

});