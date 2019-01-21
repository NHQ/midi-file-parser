/**
 * User: curtis
 * Date: 2019-01-20
 * Time: 15:02
 */

const fs=require("fs");

class Stream {
	constructor() {
		this._buffer=Buffer.alloc(0);
	}

	/**
	 * @return {Buffer}
	 */
	get buffer() {
		return this._buffer;
	}

	/**
	 * @return {Number}
	 */
	get length() {
		return this._buffer.length;
	}

	/**
	 * Appends data just as it is to our buffer
	 * @param {Buffer|Stream|string} data
	 */
	write(data) {
		if(data instanceof Stream) {
			data=data._buffer;
		}
		this._buffer=Buffer.concat([this._buffer, Buffer.from(data)]);
	}

	/**
	 * Writes 8 bit value to our buffer
	 * @param value
	 */
	writeInt8(value) {
		const buffer=Buffer.alloc(1);
		buffer.writeUInt8(value);
		this._buffer=Buffer.concat([this._buffer, buffer]);
	}

	/**
	 * Writes 16 bit int to our buffer
	 * @param value
	 */
	writeInt16(value) {
		const buffer=Buffer.alloc(2);
		buffer.writeInt16BE(value);
		this._buffer=Buffer.concat([this._buffer, buffer]);
	}

	/**
	 * Writes 32 bit int to our buffer
	 * @param value
	 */
	writeInt32(value) {
		const buffer=Buffer.alloc(4);
		buffer.writeInt32BE(value);
		this._buffer=Buffer.concat([this._buffer, buffer]);
	}

	/**
	 * Writes a variable-length integer: a big-endian value in groups of 7 bits with top bit set to signify that another byte follows
	 * @param {Number} value
	 */
	writeVarInt(value) {
		const stack=[];
		do {
			stack.push(value&0x7f);
			value=value>>7;
		} while(value!==0);
		for(let index=stack.length-1; index>-1; index--) {
			this.writeInt8((index>0) ? stack[index]|0x80 : stack[index]);
		}
	}
}

/**
 * @param {MidiIoSong} midiData
 * @returns {Buffer}
 */
function writeMidiToBuffer(midiData) {
	/**
	 * @param {Stream} stream
	 * @param {string} id
	 * @param {Buffer|Stream} data
	 */
	function writeChunk(stream, id, data) {
		stream.write(id);
		stream.writeInt32(data.length);
		stream.write(data);
	}

	/**
	 * @param {Stream} stream
	 */
	function writeHeader(stream) {
		const data=new Stream();
		data.writeInt16(midiData.header.formatType);
		data.writeInt16(midiData.tracks.length);
		data.writeInt16(midiData.header.ticksPerBeat);
		writeChunk(stream, "MThd", data);
	}

	/**
	 * todo: implement running status if you find this and can't stop yourself
	 * @param {Stream} stream
	 * @param {MidiIoTrack} track
	 */
	function writeTrack(stream, track) {
		const trackStream=new Stream();

		/**
		 * @param {MidiIoEvent} event
		 */
		function writeEvent(event) {
			function writeChannelData() {
				switch(event.subtype) {
					case "noteOff": {
						trackStream.writeInt8(0x80|event.channel);
						trackStream.writeInt8(event.noteNumber);
						trackStream.writeInt8(event.velocity);
						break;
					}
					case "noteOn": {
						trackStream.writeInt8(0x90|event.channel);
						trackStream.writeInt8(event.noteNumber);
						trackStream.writeInt8(event.velocity);
						break;
					}
					case "noteAftertouch": {
						trackStream.writeInt8(0x0a|event.channel);
						trackStream.writeInt8(event.noteNumber);
						trackStream.writeInt8(event.amount);
						break;
					}
					case "controller": {
						trackStream.writeInt8(0x0b|event.channel);
						trackStream.writeInt8(event.controllerType);
						trackStream.writeInt8(event.value);
						break;
					}
					case "programChange": {
						trackStream.writeInt8(0x0c|event.channel);
						trackStream.writeInt8(event.programNumber);
						break;
					}
					case "channelAftertouch": {
						trackStream.writeInt8(0x0d|event.channel);
						trackStream.writeInt8(event.amount);
						break;
					}
					case "pitchBend": {
						trackStream.writeInt8(0x0e|event.channel);
						trackStream.writeInt8(event.value&0x7f);
						trackStream.writeInt8(event.value>>7);
						break;
					}
					default: {
						throw new Error(`unrecognised MIDI event : ${event.subtype}`);
					}
				}
			}

			function writeMetaData() {
				function _writeText(subType) {
					const text=event.text||"";
					trackStream.writeInt8(subType);
					trackStream.writeVarInt(text.length);
					trackStream.write(text);
				}

				// write metadata's status byte
				trackStream.writeInt8(0xff);
				switch(event.subtype) {
					case "sequenceNumber": {
						trackStream.writeInt8(0x00);
						trackStream.writeVarInt(2);
						trackStream.writeInt16(event.number);
						break;
					}
					case "text": {
						_writeText(0x01); break;
					}
					case "copyrightNotice": {
						_writeText(0x02); break;
					}
					case "trackName": {
						_writeText(0x03); break;
					}
					case "instrumentName": {
						_writeText(0x04); break;
					}
					case "lyrics": {
						_writeText(0x05); break;
					}
					case "marker": {
						_writeText(0x06); break;
					}
					case "cuePoint": {
						_writeText(0x07); break;
					}
					case "midiChannelPrefix": {
						trackStream.writeInt8(0x20);
						trackStream.writeVarInt(1);
						trackStream.writeInt8(event.channel);
						break;
					}
					case "endOfTrack": {
						trackStream.writeInt8(0x2f);
						trackStream.writeVarInt(0);
						break;
					}
					case "setTempo": {
						trackStream.writeInt8(0x51);
						trackStream.writeVarInt(3);
						trackStream.writeInt8(event.microsecondsPerBeat>>16 & 0xff);
						trackStream.writeInt8(event.microsecondsPerBeat>>8 & 0xff);
						trackStream.writeInt8(event.microsecondsPerBeat & 0xff);
						break;
					}
					case "smpteOffset": {
						const frameCode={
							24: 0,
							25: 1,
							29: 2,
							30: 3
						}[event.frameRate];
						trackStream.writeInt8(0x54);
						trackStream.writeVarInt(5);
						trackStream.writeInt8(event.hour|frameCode<<5);
						trackStream.writeInt8(event.min);
						trackStream.writeInt8(event.sec);
						trackStream.writeInt8(event.frame);
						trackStream.writeInt8(event.subframe);
						break;
					}
					case "timeSignature": {
						trackStream.writeInt8(0x58);
						trackStream.writeVarInt(4);
						trackStream.writeInt8(event.numerator);
						trackStream.writeInt8(Math.log2(event.denominator));
						trackStream.writeInt8(event.metronome);
						trackStream.writeInt8(event.thirtyseconds);
						break;
					}
					case "keySignature": {
						trackStream.writeInt8(0x59);
						trackStream.writeVarInt(2);
						trackStream.writeInt8(event.key);
						trackStream.writeInt8(event.scale);
						break;
					}
					case "sequencerSpecific": {
						trackStream.writeInt8(0x7f);
						trackStream.writeVarInt(event.data.length);
						trackStream.write(event.data);
						break;
					}
					default: {
						throw new Error(`unknown channel event: ${event.subtype}`);
					}
				}
			}

			function writeSysexData() {
				throw new Error("sysex not supported yet");
			}

			// write the event's delta offset
			trackStream.writeVarInt(event.deltaTime);
			if(event.type==="channel") {
				writeChannelData();
			} else if(event.type==="meta") {
				writeMetaData();
			} else if(event.type==="sysEx") {
				writeSysexData();
			}
		}

		track.forEach(writeEvent.bind(null));
		writeChunk(stream, "MTrk", trackStream);
	}

	const stream=new Stream();
	writeHeader(stream);
	midiData.tracks.forEach(writeTrack.bind(null, stream));
	return stream.buffer;
}

/**
 * @param {MidiIoSong} midiData
 * @param {string} filePath
 * @throws {Error}
 */
function writeMidiToFile(midiData, filePath) {
	const buffer=writeMidiToBuffer(midiData);
	if(/.mid$/i.test(filePath)===false) {
		filePath+=".mid";
	}
	fs.writeFileSync(filePath, buffer, {encoding: "binary"});
}

/**
 * @param {string} filename
 * @param {Object} data - midi data in the same format it was parsed into when read
 */
module.exports={
	writeMidiToBuffer,
	writeMidiToFile
};
