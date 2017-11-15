var http = require('http');
var crypto = require('crypto');
var config = require( "./config.json" );
var async = require( "async" );
var parallel = require('run-parallel');
var path = require('path');
var _ = require('lodash');

var express = require('express'),
	expressJade = require('express-jade'),
	serveStatic = require('serve-static'),
	stylus = require('stylus'),
	nib = require('nib');

var CryptoJS = require("crypto-js");
var gameSparks = new require('./vendor/gamesparks-node/GameSparks.js');

var OKCupid = require('okcupidjs');
var okc = new OKCupid();

function onMessage( msg ) {
	console.log( "-------------------------------------------------------------" );
	console.log( "received a message:", JSON.stringify( msg, null, 2 ) );
}
function onErr( err ) {
	console.log( "-------------------------------------------------------------" );
	console.log( "received an error:", err );
	process.exit( 1 );
}

var app = express()
app.set('views', __dirname + '/public/views/');
app.set('view engine', 'jade');
//app.use(express.logger('dev'));
app.use(stylus.middleware({ 
	src: __dirname + '/public/views/',
	compile: function(str, path) {
		return stylus(str).set( 'filename', path ).use( nib() );
	}
}));
app.use(express.static(__dirname + '/public'))

app.get('/', function (req, res) {
	res.render('index',
		{ title : 'Home' }
	);
});
app.listen(3000);

/*

gameSparks.initPreviewListener( config.gameApiKey, config.secret, 10, onMessage, app, onErr);

function app() {
	console.log( "Gamesparks ready!" );

//	rip25Members();
}

function rip25Members() {
	okc.login(config.okc.username, config.okc.password, function(err, res, body) {
		var fArr = [];
			fArr.push(function (callback) {
				setTimeout(function () {

					okc.getQuickmatch(function(err, res, body) {

						if(_.isUndefined(body.sn)) {
							okc.getUserProfile(body.sn, function(err, res, body) {
								if (!_.isUndefined(body.photos) && body.photos.length > 0) {

									var ja = (!_.isUndefined(body.essays) && body.essays.length > 0) && (!_.isUndefined(body.essays[0].essay) && body.essays[0].essay.length > 0) ? body.photos[0].image_url : '';

									var o = {
										photo: _.isUndefined(body.photos) ? '' : body.photos[0].image_url,
										location: body.location,
										city: 'İstanbul',
										country: 'Turkey',
										gender: body.gender,
										about: ja,
										username: _.isUndefined(body.username) ? '' : body.username,
										age: _.isUndefined(body.age) ? Math.floor(30+Math.random()*25) : body.age,
										last_online: _.isUndefined(body.last_online) ? '' : body.last_online
									};
									console.log(o);
									callback(null, o);
								}
							});
						}
					});

				}, 100);
			});

		parallel(fArr, function (err, res) {
			gameSparks.sendAs( null, ".RegistrationRequest", {
				userName: config.testUser.username,
				displayName: config.testUser.username,
				password: '123',
				segments: res
			}, function( err, user ) {
				if ( err )
					return cb( err );
				else 
					return cb( null, user );
			});
		});

	});
}
*/