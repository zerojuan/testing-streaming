const restify = require('restify');

function respond( req, res, next ) {
	res.send( 'Hello ' + req.params.name );
	return next();
}

const server = restify.createServer();
server.get('/stream', respond);

server.listen(8081, () => {
	console.log('%s listening at %s', server.name, server.port);
});
