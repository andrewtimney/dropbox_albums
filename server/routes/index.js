var express = require('express');
var router = express.Router();
var shortid = require('shortid');
var path = require('path');
var moment = require('moment');
var azureTable = require('../azure/azure-table');
var azureBlob = require('../azure/azure-blob');
var imageService = require('../azure/image-service');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Album' });
});

router.post('/', function(req, res, next) {

  var files = JSON.parse(req.body.results);

  var album = {
    files: files,
    azureFiles: [],
    expires: moment().add(7, 'days').toDate(),
    id: shortid.generate(),
    email: req.body.email
  };

  imageService.uploadImages(album)
    .then(function(al){
      console.log('Images done');
      azureTable.createAlbum(al);
    }, function(err){
      console.error('whops', err);
    });

  res.render('albumBeingCreated', { title: 'Album Being Created', id: album.id });
});

router.get('/o', function(req, res, next) {

  azureTable.getAlbum(req.query.i, function(result, error){

    if(error){
      res.render('albumNotFound', {id:req.query.i});
    }

    var files = JSON.parse(result.files._);

    if(result.expires._ < new Date()){
      res.render('albumNotFound', {id:req.query.i});
    }

    res.render('album', {
      album: {
        id:req.query.i,
        files: files.map(function(file){
            return azureBlob.createBlobUrl(file);
          })}
      });
  });
});

module.exports = router;
