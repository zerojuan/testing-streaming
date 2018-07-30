const restify = require('restify');
const Raven = require('raven');
Raven.config('https://99bd8dda387a4397a195563db0eef302@sentry.io/1251829').install();

const Readable = require('stream').Readable;
const delay = require('delay');

function sleep( time ) {
	return new Promise( (resolve) => setTimeout(resolve, time));
}

const loopsize = 1000000 * 1000000;
async function respond( req, res, next ) {
	// start streaming data
	const s = new Readable();
	res.writeHead(200, {
       		'Content-Type': 'application/json',
		'X-Accel-Buffering': 'no'
   	});
	for( let i = 0; i < loopsize; i++ ) {
//		await sleep(1000);
		if ( i % 1000000 === 0)
			s.push('i');
//		await sleep(1000);
		//s.push('part 2');
//		await sleep(1000);
		//s.push('part 3');
	}
	
	s.push(null);
	s.pipe(res);
	
	return next();
}

const server = restify.createServer();
server.get('/stream', respond);

server.listen(8081, () => {
	console.log('%s listening at %s', server.name, server.url);
});
