var express = require('express');
var router = express.Router();
var fs = require('fs');
var shortid = require('shortid');
var path = require('path');
var moment = require('moment');
var azureTable = require('../azure-table');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/', function(req, res, next) {
  
  var files = JSON.parse(req.body.results);
  
  var album = {
    files: files,
    expires: moment().add(7, 'days').toDate(),
    id: shortid.generate()
  };
  console.log(album.id);
    
  azureTable.createAlbum(album);
  
  res.render('index', { title: 'Express', body: album.id });
});

router.get('/o', function(req, res, next) {
  
  azureTable.getAlbum(req.query.i, function(result, error){
    
    if(error){
      res.render('albumNotFound', {id:req.query.i}); 
    }
     
    var files = JSON.parse(result.files._);
    
     if(result.expires._ <  new Date()){
      res.render('albumNotFound', {id:req.query.i});
     }else{
      res.render('album', {
        album: {id:req.query.i, files: files}
      });
     }
  });
});

module.exports = router;
