var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var expressValidator = require('express-validator');
var mongojs = require('mongojs');
var db = mongojs('heyapp', ['users']);
var ObjectId = mongojs.ObjectId;

var app = express();

//view engine middleware (ejs)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


//body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//set static path for things like css & jaquery files etc.
app.use(express.static(path.join(__dirname, 'public')));

//errors global variable
app.use(function(req, res, next) {
  res.locals.errors = null;
  next();
});


//express-validator

app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
    var namespace = param.split('.')
    , root        = namespace.shift()
    , formParam   = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg : msg,
      value: value
    };
  }
}));

//pass along a different data type other than string alien from mars
// var users = [
//   {
//     id: 1,
//     first_name: 'David',
//     last_name: 'Bowie',
//     email: 'david.bowie@gmail.com'
//   },
//   {
//     id: 2,
//     first_name: 'Ziggy',
//     last_name: 'Stardust',
//     email: 'ziggy@gmail.com'
//   },
//   {
//     id: 3,
//     first_name: 'Mott',
//     last_name: 'Hoople',
//     email: 'mott@gmail.com'
//   }
// ]

app.get('/', function(req, res) {
  //mongojs
  db.users.find(function (err, docs) {
	// docs is an array of all the documents in mycollection
    console.log(docs);
    res.render('index', {
      title: 'Aliens from Mars',
      users: docs
    });
  })
});

app.post('/users/add', function(req, res) {

//validator - rules for our fields
req.checkBody('first_name', 'First name is required').notEmpty();
req.checkBody('last_name', 'Last name is required').notEmpty();
req.checkBody('email', 'Email address is required').notEmpty();

var errors = req.validationErrors();

  if (errors) {
        res.render('index', {
          title: 'Aliens from Mars',
          users: users,
          errors: errors
        });
      console.log('errors');

  } else {
      var newUser = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email
      }
     console.log('SUCCESS');
     //mongojs insert
     db.users.insert(newUser, function(err, result) {
       if(err) {
         console.log(err);
       }
       res.redirect('/');
     });
  }
});

// here's the delete route
app.delete('/users/delete/:id', function(req, res) {
 console.log(req.params.id);
 db.users.remove({_id: ObjectId(req.params.id)}, function(err, result) {
      if(err) {
        console.log(err);
      }
      res.redirect('/');
 })
});
//

app.listen(3000, function() {
  console.log('server started on Port 3000');
})
