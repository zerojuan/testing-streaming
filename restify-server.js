const restify = require('restify');
const fs = require('fs');
const Raven = require('raven');
Raven.config('https://99bd8dda387a4397a195563db0eef302@sentry.io/1251829').install();

const Readable = require('stream').Readable;
const Chunker = require('stream-chunker');
const delay = require('delay');
const {Client} = require('pg');
const QueryStream = require('pg-query-stream');
const JSONStream = require('JSONStream');

const client = new Client({
	user: 'postgres',
	host: 'localhost',
	port: '5432',
	password: 'mysecretpassword',
	database: 'postgres'
});

function sleep( time ) {
	return new Promise( (resolve) => setTimeout(resolve, time));
}

const loopsize = 1000000 * 1000000;
const chunker = Chunker(16,{});
async function respond( req, res, next ) {
	res.writeHead(200, {
       		'Content-Type': 'application/json',
		    'X-Accel-Buffering': 'no'
       });

	await client.connect();
	var query = new QueryStream('SELECT * FROM generate_series(0, $1) num', [1000000])	
	const s = client.query(query);
//	s.pipe(chunker).pipe(res);
	s.pipe(JSONStream.stringify()).pipe(chunker).pipe(res);

	s.on('end', () => {
		client.end();
	});
	return next();
}

const server = restify.createServer();
server.get('/stream', respond);

module.exports = server;
