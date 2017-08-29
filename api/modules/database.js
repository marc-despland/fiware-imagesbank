'use strict';
var util = require('util');
var mongo = require('mongodb');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

module.exports = {
  mongodburl:mongodburl,
  connect : connect,
  objectid:objectid
};

const version= "1.0.0";

//var mogodburl="mongodb://odyc3:odyc3pwd@odyc3-db:27017/odyc3";

function mongodburl() {
	var url="mongodb://";
	var mongo_port = process.env.MONGODB_PORT || 27017;
	var mongo_address = process.env.MONGODB_ADDRESS || 'database';
	var mongo_user = process.env.MONGODB_USER || '';
	var mongo_passwd = process.env.MONGODB_PASSWD || '';
	var mongo_database = process.env.MONGODB_DATABASE || 'imagesbank';
	if (mongo_user === '') {
		url += mongo_address +':'+mongo_port+'/'+mongo_database;
	} else {
		url += mongo_user+':'+mongo_passwd+'@'+mongo_address +':'+mongo_port+'/'+mongo_database;
	}
	return url;
}


function connect() {
	return new Promise(function(resolve, reject) {
		MongoClient.connect(mongodburl(), (err, database) => {
			if (err) {
				return reject(err);
			} else {
				return resolve(database);
			}
		})
	})
}

function objectid(id) {
	console.log("try to generate id for "+id);
	var o_id=id;
	try {
		o_id=ObjectID.createFromHexString(id);
	} catch(error) {};
	return o_id;
}