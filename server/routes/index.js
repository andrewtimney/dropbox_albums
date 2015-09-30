var express = require('express');
var router = express.Router();
var fs = require('fs');
var shortid = require('shortid');
var path = require('path');
var moment = require('moment');
var storage = require('../azure');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/', function(req, res, next) {
  
  var files = JSON.parse(req.body.results);
  
  var album = {
    files: files,
    expires: moment().add(7, 'days').valueOf(),
    id: shortid.generate()
  };
  console.log(album.id);
    
  fs.writeFile(
    path.join(__dirname, '../../published', album.id+'.json'), 
    JSON.stringify(album), 
    function(err){
      if(err) throw err;    
    });
  
  res.render('index', { title: 'Express', body: album.id });
});

router.get('/o', function(req, res, next) {
  
  var filePath = path.join(__dirname, '../../published', req.query.i+'.json');
  console.log(filePath);
  
  var file = fs.readFileSync(filePath, 'utf8');
  var album = JSON.parse(file);
  
  var date = moment(album.expires);
  
  if(date < moment()){
    res.render('albumNotFound', {id:album.id});
  }else{
    res.render('album', {album: album});
  }
});

module.exports = router;
