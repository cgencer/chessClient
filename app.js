var http = require('http');
var crypto = require('crypto');
var config = require( "./config.json" );
var async = require( "async" );

var CryptoJS = require("crypto-js");
var gameSparks = new require('./node_modules/gamesparks-node/GameSparks.js');

var OKCupid = require('okcupidjs');
var okc = new OKCupid();

function onMessage( msg ) {
	console.log( "-------------------------------------------------------------" );
	console.log( "received a message:", JSON.stringify( msg, null, 2 ) );
}
function onErr( err ) {
	console.log( "-------------------------------------------------------------" );
	console.log( "received an error:", err );
}
function handleReq( req, res ) {
	var nonce = req.url.substring(1);
	var processed = crypto.createHmac('SHA256', config.secret).update(nonce).digest('base64');
	res.end(processed);
}
gameSparks.initPreviewListener( config.gameApiKey, config.secret, 10, onMessage, app, function( err ) {
	console.log( "initializing preview listener:", err );
	process.exit( 1 );
});
function app() {
	console.log( "Gamesparks ready!" );

okc.login(config.okc.username, config.okc.password, function(err, res, body) {
	okc.getQuickmatch(function(err, res, body) {
		okc.getUserProfile(body.sn, function(err, res, body) {
			console.log( JSON.stringify( res, null, 2 ) );
		});
	});
});


	async.waterfall([
		function( cb ) {
			// Authenticate
			gameSparks.sendAs( null, ".AuthenticationRequest", {
				userName: config.testUser.username,
				password: config.testUser.password
			}, function( err, user ) {
				if ( err )
					return cb( err );
				else 
					return cb( null, user );
			});
		}, function( user, cb ) {
			gameSparks.sendAs( user.userId, ".AccountDetailsRequest", {}, function( err, res ) {
				if ( err ) return cb( err );
				console.log( "account details:", JSON.stringify( res, null, 2 ) );
				cb( null, user );
			});
		}
	], function( err ) {
		if ( err ) console.log( err );
		// If you want to listen for messages back from the Gamesparks server, then do
		// not exit() here.  Just sit around and wait ...
		process.exit(0);
	});
}
