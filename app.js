var http = require('http');
var crypto = require('crypto');
var gameSparks = new require('gamesparks-node');
var config = require( "./config.json" );
var async = require( "async" );

function onMessage( msg ) {
	console.log( "-------------------------------------------------------------" );
	console.log( "received a message:", JSON.stringify( msg, null, 2 ) );
}
gameSparks.initPreviewListener( config.gameApiKey, config.secret, 10, onMessage, app, function( err ) {
	console.log( "initializing preview listener:", err );
	process.exit( 1 );
});
function app() {
	console.log( "Gamesparks ready!" );

	async.waterfall([
		function( cb ) {
			// Authenticate
			gameSparks.sendAs( null, ".AuthenticationRequest", {
				userName: config.testUser.username,
				password: config.testUser.password
			}, function( err, user ) {
				if ( err ) return cb( err );
				else return cb( null, user );
			});
		}, function( user, cb ) {
			// Get the user's account details
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




/*
function handleRequest(request, response) {
	var nonce = request.url.substring(1);
	var proccessed = crypto.createHmac('SHA256', apiSecret).update(nonce).digest('base64');
	response.end(proccessed);
}

var server = http.createServer(handleRequest);
server.listen(PORT, function(){
	console.log('server up on: http://localhost:%s', PORT);
});
*/