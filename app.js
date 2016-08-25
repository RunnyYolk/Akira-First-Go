var express = require("express");
var app = express();

  var mainImage = "photos/alpine/al3.jpg"

app.set("view engine", "ejs");

app.use(express.static('public'));

app.get("/", function(req, res){
  var projects = [
    {name: "Oxcliffe Cottage", image: "photos/oxcliffe/ox1.jpg"},
    {name: "Alpine Troughs", image: "photos/alpine/al5-crop.jpg"},
    {name: "Private Residence", image: "photos/pr1/bw1-crop.jpg"},
    {name: "Millbrook Fireplace", image: "photos/millbrook/fp2.jpg"},
    {name: "Private Residence", image: "photos/pr2/pr2-1.jpg"},
    {name: "Family Crest", image: "photos/familycrest/fc1.jpg"},
    {name: "Foot Tree", image: "photos/foottree/ft2-crop.jpg"}
  ]
  res.render("index", {projects:projects});
});

app.get("/project", function(req, res){
  var images = [
    {image: "photos/alpine/al3.jpg", text: "blablabla"},
    {image: "photos/alpine/al1.jpg", text: "blablabla"},
    {image: "photos/alpine/al2.jpg", text: "blablabla"},
    {image: "photos/alpine/al4.jpg", text: "blablabla"},
    {image: "photos/alpine/al5-crop.jpg", text: "blablabla"}
  ]
  res.render("project", {images:images, mainImage:mainImage});
});

app.listen(27017, process.env.IP, function(){
  console.log("Fire it UP!");
})
