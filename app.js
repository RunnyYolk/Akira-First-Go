var bodyParser   = require("body-parser"),
    express    = require('express'),
    multer     = require('multer'),
    mongoose   = require('mongoose'),
    mime       = require('mime'),
    path       = require('path'),
    uid        = require('uid2'),
    fs         = require('fs'),
    crypto     = require('crypto'),
    Project    = require('./models/project') // Project schema
    methodOverride = require("method-override");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads')
  },
  filename: function (req, file, cb) {
    crypto.pseudoRandomBytes(16, function (err, raw) {
      cb(null, raw.toString('hex') + Date.now() + '.' + mime.extension(file.mimetype));
    });
  }
});

var upload = multer({storage: storage}).any('uploadedImages');

var app = express();

var mainImage = 'photos/alpine/al3.jpg'

//connect mongoDB
// mongoose.connect("mongodb://localhost/akira");
mongodb:nick:1234@ds019766.mlab.com:19766/akira

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(methodOverride('_method'));
app.use('/images', express.static(__dirname + '/writable'));

app.get('/', function(req, res){
  //Get all projects from the DB
  Project.find({}, function(err, allProjects){
    if(err){
      console.log('error finding projects from DB:');
      console.log(err);
    } else {
      res.render('index', {project:allProjects});
    }
  });
});

app.get('/projects/:_id', function(req, res){
    console.log("req.params");
    console.log(req.params._id);
    //find project with Id
    Project.findById(req.params._id, function(err, foundProject){
      if(err){
        console.log('Error finding project');
        console.log(err);
      } else {
        console.log(foundProject);
        res.render('project', {project: foundProject});
      }
    });
});

app.get('/new', function(req, res){
  res.render('new');
});

app.post('/projects', function (req, res){
  upload(req, res, function (err){
    if (err) {
      console.log('error');
      console.log(err)
      return;
    }
    // declare vars to new project data
    var title = req.body.title;
    var description = req.body.description;
    var images = [];
    req.files.forEach(function(file, i){
      images.push(req.files[i].path.replace('public/', '../'));
    });
    //add the project data to a newProject array
    var newProject = {title: title, description: description, images: images}
    // Create a new Project and save it to mongoDB
    Project.create(newProject, function(err, newlyCreated){
      if(err){
        console.log('Error');
        console.log(err);
      } else {
        console.log(newlyCreated);
        res.redirect('/');
      }
    });
  });
});

// add new photos to the DB
// app.post('/projects', function(req, res){
//   upload(req, res, function(err){
//     if(err){
//       console.log('Oh dear...');
//       console.log(err);
//       return;
//     }
//     console.log(req.files);
//     res.end('Your files uploaded!');
//     console.log('Yep yep!');
//   });
//   console.log('req.body');
//   console.log(req.body);
// });

app.listen(process.env.PORT, process.env.IP, function(){
  console.log('Fire it UP!');
})
