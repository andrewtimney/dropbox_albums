var express = require('express');
var router = express.Router();
var shortid = require('shortid');
var path = require('path');
var moment = require('moment');
var azureTable = require('../azure/azure-table');
var azureBlob = require('../azure/azure-blob');
var imageService = require('../azure/image-service');
var io;

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Album' });
});

router.get('/a', function(req, res, next) {
  res.render('albumBeingCreated', { id: 'sdf9dfskdsf'});
});

router.post('/', function(req, res, next) {

  var files = JSON.parse(req.body.results);

  var album = {
    files: files,
    azureFiles: [],
    expires: moment().add(7, 'days').toDate(),
    id: shortid.generate(),
    title: req.body.albumTitle
  };

  imageService.uploadImages(album)
    .then(function(al){
      console.log('Images done');
      azureTable.createAlbum(al);
      io.emit('album done', { success: true });
    }, function(err){
      console.error('whops', err);
    });

  res.redirect('/o?i='+album.id);

  //res.render('albumBeingCreated', { title: 'Album Being Created', id: album.id });
});

router.get('/o', function(req, res, next) {
  try{
    azureTable.getAlbum(req.query.i, function(result, error){

      if(error || !result){
        return res.render('albumBeingCreated', { title: 'Album Being Created', id: req.query.i });
      }

      var files = JSON.parse(result.files._);

      if(result.expires._ < new Date()){
        // Album expired
        res.render('albumNotFound', {id:req.query.i});
      }

      res.render('album', {
        album: {
          id:req.query.i,
          files: files.map(function(file){
            return { thumb:azureBlob.createBlobUrl(file.thumb),
              image:azureBlob.createBlobUrl(file.image)};
          }),
          title: result.title._,
          expires: moment(result.expires._)
        }
      });
    });
  }
  catch(error){
    res.render('albumNotFound', {id:req.query.i});
  }
});

module.exports = {
  router: router,
  loadIO: function(socketio){
    io = socketio;
  }
};
