const server = require('./restify-server');

server.listen(8081, () => {
	console.log('%s listening at %s', server.name, server.url);
});
