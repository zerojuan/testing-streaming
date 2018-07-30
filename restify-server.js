const restify = require('restify');
const Raven = require('raven');
Raven.config('https://99bd8dda387a4397a195563db0eef302@sentry.io/1251829').install();

const Readable = require('stream').Readable;
const Chunker = require('stream-chunker');
const delay = require('delay');

function sleep( time ) {
	return new Promise( (resolve) => setTimeout(resolve, time));
}

const loopsize = 1000000 * 1000000;
const chunker = Chunker(16,{});
async function respond( req, res, next ) {
	// start streaming data
	const s = new Readable();
	res.writeHead(200, {
       		'Content-Type': 'application/json',
		    'X-Accel-Buffering': 'no'
   	});
	for( let i = 0; i < loopsize; i++ ) {
		if ( i % 1000000 === 0)
			s.push('i');
	}

	s.push(null);
	s.pipe(chunker).pipe(res);

	return next();
}

const server = restify.createServer();
server.get('/stream', respond);

module.exports = server;