'use strict';
var database = require('modules/database');
var crypto = require('crypto');
var stream = require('stream');
var mongodb = require('mongodb');
var sharp = require('sharp');
var orion = require('modules/orion');

var DBPREFIX=process.env.MONGODB_DATABASE || 'imagesbank';

module.exports = {
	getFiwareImage:getFiwareImage,
	uploadFiwareImage:uploadFiwareImage
};


function getImage(db,collection,imageid) {
	return new Promise(function(resolve, reject) {
		var o_id=database.objectid(imageid);
		db.collection(collection+".files").findOne({"_id": o_id}).then(function(file) {
			if (file===null) {
				reject("File "+imageid+" on collection "+collection+" doesn't exist");
			} else {
				resolve(file);
			}
		}).catch(function(error) {
			console.log("Failed to retrieve image");
			reject(error);
		});
	});
	
}


function getFiwareImage(req, res) {
	database.connect().then(function(db) {
		var collection=req.swagger.params.entity.value+"-"+req.swagger.params.attribute.value;
		orion.getImageId(req.swagger.params.entity.value, req.swagger.params.attribute.value).then(function(imageid) {
			var options={};
			options.bucketName=collection;
			var bucket = new mongodb.GridFSBucket(db,options);
			getImage(db, collection, imageid).then(function(file) {
				console.log(bucket);
				var downloadStream=bucket.openDownloadStream(file._id).on('error', function(error) {
					console.log("open error : "+ error);
				});
				console.log("File id : "+file._id);
				res.statusCode=200;
				res.contentType(file.contentType);
				downloadStream.on('error', function(error) {
					console.log("Download error : "+ error);
				});
				downloadStream.on('data', function(data) {
					console.log("Download data : "+ data.length);
					res.write(data);
				});
				downloadStream.on('end', function() {
					db.close();
					res.end();
				});
			}).catch(function(err) {
				console.log(err);
				res.statusCode=500;
				db.close();
				var message={'error': 'InternalError', 'description': JSON.stringify(err)};
				res.json(message);
			});
		}).catch(function(error) {
			console.log(err);
			res.statusCode=500;
			res.json(error);
		});
	}).catch(function(err) {
		console.log(err);
		res.statusCode=500;
		var message={'error': 'InternalError', 'description': 'Database issue : ' + JSON.stringify(err)};
		res.json(message);
	});

}

function uploadFiwareImage(req, res) {
	database.connect().then(function(db) {
		var options={};
		var collection=req.swagger.params.entity.value+"-"+req.swagger.params.attribute.value;
		options.bucketName=collection;
		var bucket = new mongodb.GridFSBucket(db,options);
		var bufferStream = new stream.PassThrough();
		bufferStream.end(req.swagger.params.image.originalValue.buffer);
		var streamoptions={};
		streamoptions.contentType=req.swagger.params.image.originalValue.mimetype;
		var uploadStream=bucket.openUploadStream(req.swagger.params.image.originalValue.originalname,streamoptions);
		var id = uploadStream.id;

		bufferStream.pipe(uploadStream).
		on('error', function(error) {
			console.log(error);
			db.close();
			res.statusCode=500;
			var message={'error': 'InternalError', 'description': JSON.stringify(error)};
			res.json(message);
		}).
		on('finish', function() {
			console.log('done! '+id);
			orion.updateImageId(req.swagger.params.entity.value, req.swagger.params.attribute.value, id).then(function() {
				res.contentType("application/json");
				res.statusCode=200;
				var image={};
				image.imageid=id;
				db.close();
				res.json(image);
			}).catch(function(error) {
				console.log(error);
				res.statusCode=500;
				res.json(error);
			});
		});

	}).catch(function(err) {
		console.log(err);
		res.statusCode=500;
		var message={'error': 'InternalError', 'description': 'Database issue : ' + JSON.stringify(err)};
		res.json(message);
	});

}