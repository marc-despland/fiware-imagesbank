'use strict';

var Client = require('node-rest-client').Client;


var ORION=process.env.ORION_URL || 'http://127.0.0.1:1026';

module.exports = {
	getImageId:getImageId,
	updateImageId:updateImageId
};


function getImageId(entity, attribute) {
	return new Promise(function(resolve, reject) {
		var client = new Client();
		var args = {};
		var request=client.get(ORION+"/v2/entities/"+entity+"/attrs/"+attribute, args, function (data, response) {
			console.log("Orion GetImageId OK : "+JSON.stringify(data));
			resolve(data.value);
		});
		request.on('requestTimeout', function (req) {
			console.log("Orion GetImageIdrequest has expired");
			request.abort();
			var error={ 'error' : 'Timeout', 'description': 'A timeout occurs sending the ORION request'};
			reject(error);
		});

		request.on('responseTimeout', function (response) {
			console.log('response has expired');
			var error={ 'error' : 'Timeout', 'description': 'A timeout occurs waiting the ORION response'};
			reject(error);
		});

		request.on('error', function (err) {
			console.log('request error', err);
			var error={ 'error' : 'InternalError', 'description': JSON.stringify(err)};
			reject(error);
		});
	});
}

function updateImageId(entity, attribute, imageid) {
	return new Promise(function(resolve, reject) {
		var client = new Client();
		console.log("Image Id :"+imageid);
		var attr= {};
		attr[attribute]={};
		attr[attribute].value=imageid;
		attr[attribute].type="string";
		var args = {
			data: attr,
			headers: { "Content-Type": "application/json" }
		};
		var request=client.patch(ORION+"/v2/entities/"+entity+"/attrs", args, function (data, response) {
			console.log("Orion updateImageId OK : "+ JSON.stringify(data));
			if (data.error!==undefined) {
				reject(data);
			} else {
				resolve();
			}
		});
		request.on('requestTimeout', function (req) {
			console.log("Orion updateImageId request has expired");
			request.abort();
			var error={ 'error' : 'Timeout', 'description': 'A timeout occurs sending the ORION request'};
			reject(error);
		});

		request.on('responseTimeout', function (response) {
			console.log('Orion updateImageId response has expired');
			var error={ 'error' : 'Timeout', 'description': 'A timeout occurs waiting the ORION response'};
			reject(error);
		});

		request.on('error', function (err) {
			console.log('Orion updateImageId request error', err);
			var error={ 'error' : 'InternalError', 'description': JSON.stringify(err)};
			reject(error);
		});
	});
}