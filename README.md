# midi-file-parser
```
npm install https://github.com/hbo-curt/midi-file-io
```
Forked from [midi-file-parser](https://github.com/NHQ/midi-file-parser). Special thanks to the authors.

Added write functionality with small revisions to the read functionity. Probably not as portable as it was. File IO has dependencies on NodeJS's `fs`. Feel free to fork it and pull it out if this gets in your way.


## usage
Functionality is broken up into read and write. Each of these are broken up into a file operation and a buffer operation:
- `parseMidiBuffer` - parses the binary MIDI buffer into a [MidiFile](./types.js)
- `parseMidiFile` - parses the MIDI file at the specified path into a [MidiFile](./types.js)
- `writeMidiToBuffer` - writes the specified [MidiFile](./types.js) object to a returned  `Buffer`.
- `writeMidiToFile` -  writes the specified [MidiFile](./types.js) object to the specified path.

## parseMidiBuffer
```js
const midiFileIO = require('midi-file-parser');

const buffer = require('fs').readFileSync('rachnananov.mid', 'binary')
const parsed = parseMidiBuffer(buffer);
```

## parseMidiFile
```js
const midiFileIO = require('midi-file-parser');

const parsed = parseMidiFile('rachnananov.mid');
```

## writeMidiToBuffer
```js
const midiFileIO = require('midi-file-parser');

const parsed = parseMidiFile('rachnananov.mid');
const buffer = writeMidiToBuffer(parsed);
```

## writeMidiToFile
```js
const midiFileIO = require('midi-file-parser');

const parsed = parseMidiFile('rachnananov.mid');
const buffer = writeMidiToFile(parsed, 'rachnananov-copy.mid');
```
