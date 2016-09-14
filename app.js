"use strict";

var bodyParser   = require("body-parser"),
    express    = require('express'),
    multer     = require('multer'),
    mongoose   = require('mongoose'),
    mime       = require('mime'),
    path       = require('path'),
    uid        = require('uid2'),
    fs         = require('fs'),
    crypto     = require('crypto'),
    Project    = require('./models/project'), // Project schema
    Promise = require("bluebird"),
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
mongoose.connect("mongodb://localhost/akira");
// mongoose.connect("mongodb://nick:1234@ds019766.mlab.com:19766/akira");
mongoose.Promise = Promise;

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(methodOverride('_method'));
app.use('/images', express.static(__dirname + '/writable'));

// Routes

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

// app.get('/projects/:_id', function(req, res){
// var nextProject = Project.find({_id: {$gt: req.params._id}}).sort({_id: 1 }).limit(1)
// var prevProject = Project.find({_id: {$lt: req.params._id}}).sort({_id: -1 }).limit(1)
// console.log('nextProject');
// console.log(nextProject);
// console.log('==============================================');
// console.log('prevProject');
// console.log(prevProject);
// Project.findById(req.params._id, function(err, foundProject){ // find the project for the clicked link
//   if(err){ // handle any errors
//     console.log('Error finding project');
//     console.log(err);
//   } else { // if no errors, execute the query object for the next project
//       nextProject.exec(function(err, next){
//         if(err){
//           console.log('err');
//           console.log(err);
//         } else if(next){ // if next has a value...
//           prevProject.exec(function(err, prev){ // ... execute the query object for the previous project
//             if(err){
//               console.log('err');
//               console.log(err);
//             } else if(prev){ // if previous has a value...
//               console.log(prev[0].title);
//               console.log('==============================================');
//               console.log(foundProject);
//               console.log('==============================================');
//               console.log(next[0].title);
//               res.render('project', {project: foundProject, nextProject: next[0], prevProject: prev[0]}); //... render the project page with current project, next project and previous project
//             } else { // if previous doesn't have a value...
//               var prevProject = Project.find().sort({_id: -1}).limit(1); //... get a query object for the last document in the database
//               prevProject.exec(function(err, prev){ // execute the query object for the last document
//                 if(err){
//                   console.log('err');
//                   console.log(err);
//                 } else { // with no errors...
//                   console.log(prev[0].title);
//                   console.log('==============================================');
//                   console.log(foundProject);
//                   console.log('==============================================');
//                   console.log(next[0].title);
//                   res.render('project', {project: foundProject, nextProject: next[0], prevProject: prev[0]}); // ... render the page
//                 }
//               });
//             }
//           });
//         } else { //if next doesn't have a value...
//           var nextProject = Project.find().sort({_id: 1 }).limit(1); // ... get a query object for the first document
//           nextProject.exec(function(err, next){ // execute the query object
//             if(err){
//               console.log('err');
//               console.log(err);
//             } else { // with no errors...
//               console.log(prev[0].title);
//               console.log('==============================================');
//               console.log(foundProject);
//               console.log('==============================================');
//               console.log(next[0].title);
//               res.render('project', {project: foundProject, nextProject: next[0], prevProject: prev[0]}); //... render the page
//           };
//         });
//       }
//     });
//   });
// });

app.get('/projects/:_id', function(req, res){
  var nextProject = Project.find({_id: {$gt: req.params._id}}).sort({_id: 1 }).limit(1)
  var prevProject = Project.find({_id: {$lt: req.params._id}}).sort({_id: -1 }).limit(1)
  // find the project for the clicked link
  Project.find({}, function(err, allProjects){
    if(err){
      console.log('error finding projects from DB:');
      console.log(err);
    } else {
      console.log("==========================================================");
      console.log(allProjects);
      console.log("==========================================================");
    Project.findById(req.params._id, function(err, foundProject){
      if(err){ // handle any errors
        console.log('Error finding project');
        console.log(err);
      } else {
        nextProject.exec(function(err, next){ // if no errors, execute the query object for the next project
          if(err){ // handle any errors
            console.log('Error getting next project');
            console.log(err);
          } else if(next.length > 0){ // if next has a value...
            prevProject.exec(function(err, prev){ // ... execute the query object for the previous project
              if(err){  // handle any errors
                console.log('error getting previous project');
                console.log(err);
              } else if(prev.length > 0){ // if previous has a value...
                console.log('prev and next have a value');
                console.log('============================foundProject============================');
                console.log(foundProject);
                console.log('============================prevProject============================');
                console.log(prev);
                console.log('============================nextProject============================');
                console.log(next);
                console.log('next.length');
                console.log(next.length);
                res.render('project', {projects: allProjects, project: foundProject, nextProject: next[0], prevProject: prev[0]});//... render the project page with current project, next project and previous project
              } else { // if previous doesn't have a value...
                var prevProject = Project.find().sort({_id: -1}).limit(1);//... get a query object for the last document in the database
                prevProject.exec(function(err, prev){ // execute the query object for the last document
                  if(err){ // handle any errors
                    console.log('error getting last document');
                    console.log(err);
                  } else { // with no errors...
                    console.log('next has a value, but previous does not. Gone to last project');
                    res.render('project', {projects: allProjects, project: foundProject, nextProject: next[0], prevProject: prev[0]}); // ... render the page
                  }
                });
              }
            });
          } else { //if next doesn't have a value...
            var nextProject = Project.find().sort({_id: 1 }).limit(1);//get a query object for the first document
            nextProject.exec(function(err, next){ // execute the query object
              if(err){
                console.log('error getting first project');
                console.log(err);
              } else { // with no errors...
                prevProject.exec(function(err, prev){ // ... execute the query object for the previous project
                  if(err){  // handle any errors
                    console.log('error getting previous project');
                    console.log(err);
                  } else if(prev.length > 0){ // if previous has a value...
                    console.log('prev and next have a value');
                    console.log('============================foundProject============================');
                    console.log(foundProject);
                    console.log('============================prevProject============================');
                    console.log(prev);
                    console.log('============================nextProject============================');
                    console.log(next);
                    console.log('next.length');
                    console.log(next.length);
                    res.render('project', {projects: allProjects, project: foundProject, nextProject: next[0], prevProject: prev[0]});//... render the project page with current project, next project and previous project
                  } else { // if previous doesn't have a value...
                    var prevProject = Project.find().sort({_id: -1}).limit(1);//... get a query object for the last document in the database
                    prevProject.exec(function(err, prev){ // execute the query object for the last document
                      if(err){ // handle any errors
                        console.log('error getting last document');
                        console.log(err);
                      } else { // with no errors...
                        console.log('next has a value, but previous does not. Gone to last project');
                        res.render('project', {projects: allProjects, project: foundProject, nextProject: next[0], prevProject: prev[0]}); // ... render the page
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
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

// app.listen(process.env.PORT, process.env.IP, function(){
app.listen(27017, process.env.IP, function(){
  console.log('Fire it UP!');
})
