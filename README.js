# midi-file-parser
```
npm install midi-file-parser
```
The midi file parsing parts of [jasmid](https://github.com/gasman/jasmid)

Special thanks to the authors.

## usage
Its just a function that takes a binary string.
```js
var midiFileParser = require('midi-file-parser');

var file = require('fs').readFileSync('rachnananov.mid', 'binary')

var midi = midiFileParser(file);
```
You can use it with [browserify](https://github.com/substack/browserify) and [brfs](https://github.com/substack/brfs):
```js
var midiFileParser = require('midi-file-parser');

var fs = require('fs')

var file = fs.readFileSync('rachnananov.mid', 'base46')

file = window.atob(file)

var midi = midiFileParser(file);
```