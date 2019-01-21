const fs=require("fs");

/**
 * Wrapper for accessing strings through sequential reads
 * @param {string} str
 */
function Stream(str) {
	var position=0;

	function read(length) {
		var result=str.substr(position, length);
		position+=length;
		return result;
	}

	/* read a big-endian 32-bit integer */
	function readInt32() {
		var result=(
			(str.charCodeAt(position)<<24)
			+(str.charCodeAt(position+1)<<16)
			+(str.charCodeAt(position+2)<<8)
			+str.charCodeAt(position+3));
		position+=4;
		return result;
	}

	/* read a big-endian 16-bit integer */
	function readInt16() {
		var result=(
			(str.charCodeAt(position)<<8)
			+str.charCodeAt(position+1));
		position+=2;
		return result;
	}

	/* read an 8-bit integer */
	function readInt8(signed) {
		var result=str.charCodeAt(position);
		if(signed && result>127) {
			result-=256;
		}
		position+=1;
		return result;
	}

	function eof() {
		return position>=str.length;
	}

	/* read a MIDI-style variable-length integer
		(big-endian value in groups of 7 bits,
		with top bit set to signify that another byte follows)
	*/
	function readVarInt() {
		var result=0;
		while(true) {
			var b=readInt8();
			if(b&0x80) {
				result+=(b&0x7f);
				result<<=7;
			} else {
				/* b is the last byte */
				return result+b;
			}
		}
	}

	return {
		eof,
		read,
		readInt32,
		readInt16,
		readInt8,
		readVarInt
	};
}


/**
 * @param {string} data
 * @return {MidiFile}
 */
function parseMidiBuffer(data) {
	let lastEventTypeByte;

	/**
	 * @param {Stream} stream
	 * @return {{data: string, length: number, id: string}}
	 */
	function readChunk(stream) {
		const id=stream.read(4);
		const length=stream.readInt32();
		return {
			id,
			length,
			"data": stream.read(length)
		};
	}

	/**
	 * @param {Stream} stream
	 * @returns {MidiEvent}
	 */
	function readEvent(stream) {
		const event={};
		event.deltaTime=stream.readVarInt();
		var eventTypeByte=stream.readInt8();
		if((eventTypeByte&0xf0)==0xf0) {
			/* system / meta event */
			if(eventTypeByte==0xff) {
				/* meta event */
				event.type="meta";
				var subtypeByte=stream.readInt8();
				var length=stream.readVarInt();
				switch(subtypeByte) {
					case 0x00:
						event.subtype="sequenceNumber";
						if(length!=2) {
							throw new Error(`Expected length for sequenceNumber event is 2, got ${length}`);
						}
						event.number=stream.readInt16();
						return event;
					case 0x01:
						event.subtype="text";
						event.text=stream.read(length);
						return event;
					case 0x02:
						event.subtype="copyrightNotice";
						event.text=stream.read(length);
						return event;
					case 0x03:
						event.subtype="trackName";
						event.text=stream.read(length);
						return event;
					case 0x04:
						event.subtype="instrumentName";
						event.text=stream.read(length);
						return event;
					case 0x05:
						event.subtype="lyrics";
						event.text=stream.read(length);
						return event;
					case 0x06:
						event.subtype="marker";
						event.text=stream.read(length);
						return event;
					case 0x07:
						event.subtype="cuePoint";
						event.text=stream.read(length);
						return event;
					case 0x20:
						event.subtype="midiChannelPrefix";
						if(length!=1) {
							throw new Error(`Expected length for midiChannelPrefix event is 1, got ${length}`);
						}
						event.channel=stream.readInt8();
						return event;
					case 0x2f:
						event.subtype="endOfTrack";
						if(length!=0) {
							throw new Error(`Expected length for endOfTrack event is 0, got ${length}`);
						}
						return event;
					case 0x51:
						event.subtype="setTempo";
						if(length!=3) {
							throw new Error(`Expected length for setTempo event is 3, got ${length}`);
						}
						event.microsecondsPerBeat=(
							(stream.readInt8()<<16)
							+(stream.readInt8()<<8)
							+stream.readInt8()
						);
						return event;
					case 0x54:
						event.subtype="smpteOffset";
						if(length!=5) {
							throw new Error(`Expected length for smpteOffset event is 5, got ${length}`);
						}
						var hourByte=stream.readInt8();
						event.frameRate={
							0x00: 24, 0x20: 25, 0x40: 29, 0x60: 30
						}[hourByte&0x60];
						event.hour=hourByte&0x1f;
						event.min=stream.readInt8();
						event.sec=stream.readInt8();
						event.frame=stream.readInt8();
						event.subframe=stream.readInt8();
						return event;
					case 0x58:
						event.subtype="timeSignature";
						if(length!=4) {
							throw new Error(`Expected length for timeSignature event is 4, got ${length}`);
						}
						event.numerator=stream.readInt8();
						event.denominator=Math.pow(2, stream.readInt8());
						event.metronome=stream.readInt8();
						event.thirtyseconds=stream.readInt8();
						return event;
					case 0x59:
						event.subtype="keySignature";
						if(length!=2) {
							throw new Error(`Expected length for keySignature event is 2, got ${length}`);
						}
						event.key=stream.readInt8(true);
						event.scale=stream.readInt8();
						return event;
					case 0x7f:
						event.subtype="sequencerSpecific";
						event.data=stream.read(length);
						return event;
					default:
						// console.log("Unrecognised meta event subtype: " + subtypeByte);
						event.subtype="unknown";
						event.data=stream.read(length);
						return event;
				}
				event.data=stream.read(length);
				return event;
			} else if(eventTypeByte==0xf0) {
				event.type="sysEx";
				const length=stream.readVarInt();
				event.data=stream.read(length);
				return event;
			} else if(eventTypeByte==0xf7) {
				event.type="dividedSysEx";
				const length=stream.readVarInt();
				event.data=stream.read(length);
				return event;
			} else {
				throw new Error(`Unrecognised MIDI event type byte: ${eventTypeByte}`);
			}
		} else {
			/* channel event */
			var param1;
			if((eventTypeByte&0x80)==0) {
				/* running status - reuse lastEventTypeByte as the event type.
					eventTypeByte is actually the first parameter
				*/
				param1=eventTypeByte;
				eventTypeByte=lastEventTypeByte;
			} else {
				param1=stream.readInt8();
				lastEventTypeByte=eventTypeByte;
			}
			var eventType=eventTypeByte>>4;
			event.channel=eventTypeByte&0x0f;
			event.type="channel";
			switch(eventType) {
				case 0x08:
					event.subtype="noteOff";
					event.noteNumber=param1;
					event.velocity=stream.readInt8();
					return event;
				case 0x09:
					event.noteNumber=param1;
					event.velocity=stream.readInt8();
					if(event.velocity==0) {
						event.subtype="noteOff";
					} else {
						event.subtype="noteOn";
					}
					return event;
				case 0x0a:
					event.subtype="noteAftertouch";
					event.noteNumber=param1;
					event.amount=stream.readInt8();
					return event;
				case 0x0b:
					event.subtype="controller";
					event.controllerType=param1;
					event.value=stream.readInt8();
					return event;
				case 0x0c:
					event.subtype="programChange";
					event.programNumber=param1;
					return event;
				case 0x0d:
					event.subtype="channelAftertouch";
					event.amount=param1;
					return event;
				case 0x0e:
					event.subtype="pitchBend";
					event.value=param1+(stream.readInt8()<<7);
					return event;
				default:
					throw new Error(`Unrecognised MIDI event type: ${eventType}`);
			}
		}
	}

	/**
	 * @param {Stream} stream
	 * @returns {MidiHeader}
	 */
	function readHeader(stream) {
		const headerChunk=readChunk(stream);
		if(headerChunk.id!="MThd" || headerChunk.length!=6) {
			throw new Error("Bad .mid file - header not found");
		}
		const headerStream=new Stream(headerChunk.data),
			header={
				formatType: headerStream.readInt16(),
				trackCount: headerStream.readInt16(),
				ticksPerBeat: headerStream.readInt16()
			};
		if(header.ticksPerBeat&0x8000) {
			throw new Error("Expressing time division in SMTPE frames is not supported yet");
		}
		return header;
	}

	/**
	 * @param {Stream} stream
	 * @return {MidiTrack}
	 */
	function readTrack(stream) {
		const trackChunk=readChunk(stream);
		if(trackChunk.id!="MTrk") {
			throw new Error(`Unexpected chunk - expected MTrk, got ${trackChunk.id}`);
		}
		const track=[],
			trackStream=new Stream(trackChunk.data);
		while(!trackStream.eof()) {
			track.push(readEvent(trackStream));
		}
		return track;
	}

	const stream=new Stream(data),
		header=readHeader(stream),
		tracks=[];
	for(let i=0; i<header.trackCount; i++) {
		tracks.push(readTrack(stream));
	}
	return {
		header,
		tracks
	};
}

/**
 * @param {string} path
 * @return {MidiFile}
 */
function parseMidiFile(path) {
	const buffer=fs.readFileSync(path, {encoding: "binary"});
	return parseMidiBuffer(buffer);
}

module.exports={
	parseMidiBuffer,
	parseMidiFile
};

