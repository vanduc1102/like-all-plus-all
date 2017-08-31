var file_system = require('fs');
var archiver = require('archiver');
const manifest = require('../src/manifest.json');

var version = 'like-all-v' + manifest.version + '.zip';
var dist = 'dist/';
var releasePath =  dist + version;
var output = file_system.createWriteStream( releasePath, { flag:'w' });

var archive = archiver('zip');

output.on('close', function () {
	console.log(archive.pointer() + ' total bytes');
	console.log('Released file : ' + releasePath);
});

archive.on('error', function (err) {
	throw err;
});

archive.pipe(output);
archive.directory('src/');
archive.finalize();