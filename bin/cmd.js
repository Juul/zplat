#!/usr/bin/env node

var path = require('path');
var fs = require('fs');
var minimist = require('minimist');

const PNG = require('pngjs').PNG;
const rgbaToZ64 = require('zpl-image').rgbaToZ64;

const argv = minimist(process.argv.slice(2), {
  alias: {
    d: 'debug' // enable debug mode
    
  },
  boolean: [
    'debug',
  ]
});

function debug() {
  if(!argv.debug) return;
  var args = Array.prototype.splice.call(arguments, 0);
  args = ['[debug]'].concat(args);

  console.log.apply(null, args);
}

function usage(isErr) {
  var f;
  if(isErr) {
    f = console.error;
  } else {
    f = console.log;
  }
  
  f("Usage:", path.basename(__filename), "<file.png>");
  if(isErr) process.exit(1);
  process.exit(0);
}

if(argv._.length < 1) {
  usage(true);
}

const fileToPrint = argv._[0];

// rotation can be:
// 'N': Normal
// 'L': Left
// 'R': Right
// 'I': Inverted
function makeZPL(data, width, filename, rotation, monochromeThreshold) {
  rotation = rotation || 'N';
  monochromeThreshold = monochromeThreshold || 52;

  let res = rgbaToZ64(data, width, {
    black: monochromeThreshold,
    rotate: rotation
  });
  
	var zpl = '';
  zpl += '^XA\n';
  zpl += '^PR2,2,2\n'; // print speed https://support.zebra.com/cpws/docs/zpl/PR_Command.pdf
  zpl += '~SD30\n';
  
  // This is just a comment
  zpl += '^FX ' + filename + ' (' + res.width + 'x' + res.height + 'px, ' +
		rotation + '-Rotate, ' + monochromeThreshold + '% Black)^FS\n';

  zpl += '^GFA,' + res.length + ',' + res.length + ',' + res.rowlen + ',' + res.z64 + '\n';
  zpl += "^XZ";
  return zpl;
}

fs.createReadStream(fileToPrint)
  .pipe(new PNG({ filterType: 4 }))
  .on('parsed', function() {
    // res is the same as above

    let zpl = makeZPL(this.data, this.width, path.basename(fileToPrint), 'N');

    console.log(zpl);
  });


