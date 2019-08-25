import {readFileSync} from "fs";
import {ReadStream} from "./stream/read";
import {
	MidiIoEvent,
	MidiIoEventSubtype,
	MidiIoEventType,
	MidiIoHeader,
	MidiIoSong,
	MidiIoTrack
} from "./types";


export function parseMidiBuffer(data: string): MidiIoSong {
	let lastEventTypeByte: number;

	function readChunk(stream: ReadStream): {
		data: string,
		id: string,
		length: number
	} {
		const id = stream.read(4);
		const length = stream.readInt32();
		return {
			id,
			length,
			data: stream.read(length)
		};
	}

	function readEvent(stream: ReadStream): MidiIoEvent {
		// @ts-ignore
		const event: MidiIoEvent = {
			deltaTime: stream.readVarInt(),
			// note: we don't know these yet but are defaulting to get around ts errors
			subtype: MidiIoEventSubtype.unknown
		};
		let eventTypeByte = stream.readInt8();
		if((eventTypeByte & 0xf0) == 0xf0) {
			/* system / meta event */
			if(eventTypeByte == 0xff) {
				/* meta event */
				event.type = MidiIoEventType.meta;
				const subtypeByte = stream.readInt8(),
					length = stream.readVarInt();
				switch(subtypeByte) {
					case 0x00:
						event.subtype = MidiIoEventSubtype.sequenceNumber;
						if(length != 2) {
							throw new Error(`expected length for sequenceNumber event is 2 but found ${length}`);
						}
						event.number = stream.readInt16();
						return event;
					case 0x01:
						event.subtype = MidiIoEventSubtype.text;
						event.text = stream.read(length);
						return event;
					case 0x02:
						event.subtype = MidiIoEventSubtype.copyrightNotice;
						event.text = stream.read(length);
						return event;
					case 0x03:
						event.subtype = MidiIoEventSubtype.trackName;
						event.text = stream.read(length);
						return event;
					case 0x04:
						event.subtype = MidiIoEventSubtype.instrumentName;
						event.text = stream.read(length);
						return event;
					case 0x05:
						event.subtype = MidiIoEventSubtype.lyrics;
						event.text = stream.read(length);
						return event;
					case 0x06:
						event.subtype = MidiIoEventSubtype.marker;
						event.text = stream.read(length);
						return event;
					case 0x07:
						event.subtype = MidiIoEventSubtype.cuePoint;
						event.text = stream.read(length);
						return event;
					case 0x20:
						event.subtype = MidiIoEventSubtype.midiChannelPrefix;
						if(length != 1) {
							throw new Error(`expected length for midiChannelPrefix event is 1 but found ${length}`);
						}
						event.channel = stream.readInt8();
						return event;
					case 0x2f:
						event.subtype = MidiIoEventSubtype.endOfTrack;
						if(length != 0) {
							throw new Error(`expected length for endOfTrack event is 0 but found ${length}`);
						}
						return event;
					case 0x51:
						event.subtype = MidiIoEventSubtype.setTempo;
						if(length != 3) {
							throw new Error(`expected length for setTempo event is 3 but found ${length}`);
						}
						event.microsecondsPerBeat = (
							(stream.readInt8() << 16)
							+ (stream.readInt8() << 8)
							+ stream.readInt8()
						);
						return event;
					case 0x54:
						event.subtype = MidiIoEventSubtype.smpteOffset;
						if(length != 5) {
							throw new Error(`expected length for smpteOffset event is 5 but found ${length}`);
						}
						let hourByte = stream.readInt8();
						event.frameRate = [24, 25, 29, 30][hourByte >> 5];
						event.hour = hourByte & 0x1f;
						event.min = stream.readInt8();
						event.sec = stream.readInt8();
						event.frame = stream.readInt8();
						event.subframe = stream.readInt8();
						return event;
					case 0x58:
						event.subtype = MidiIoEventSubtype.timeSignature;
						if(length != 4) {
							throw new Error(`expected length for timeSignature event is 4 but found ${length}`);
						}
						event.numerator = stream.readInt8();
						event.denominator = Math.pow(2, stream.readInt8());
						event.metronome = stream.readInt8();
						event.thirtyseconds = stream.readInt8();
						return event;
					case 0x59:
						event.subtype = MidiIoEventSubtype.keySignature;
						if(length != 2) {
							throw new Error(`expected length for keySignature event is 2 but found ${length}`);
						}
						event.key = stream.readInt8(true);
						event.scale = stream.readInt8();
						return event;
					case 0x7f:
						event.subtype = MidiIoEventSubtype.sequencerSpecific;
						event.data = stream.read(length);
						return event;
					default:
						// console.log("Unrecognised meta event subtype: " + subtypeByte);
						event.subtype = MidiIoEventSubtype.unknown;
						event.data = stream.read(length);
						return event;
				}
			} else if(eventTypeByte == 0xf0) {
				const length = stream.readVarInt();
				event.type = MidiIoEventType.sysEx;
				event.data = stream.read(length);
				return event;
			} else if(eventTypeByte == 0xf7) {
				const length = stream.readVarInt();
				event.type = MidiIoEventType.dividedSysEx;
				event.data = stream.read(length);
				return event;
			} else {
				throw new Error(`unrecognised MIDI event type byte "${eventTypeByte}"`);
			}
		} else {
			/* channel event */
			let param1;
			if((eventTypeByte & 0x80) == 0) {
				//  running status - reuse lastEventTypeByte as the event type. eventTypeByte is actually the first parameter
				param1 = eventTypeByte;
				eventTypeByte = lastEventTypeByte;
			} else {
				param1 = stream.readInt8();
				lastEventTypeByte = eventTypeByte;
			}
			const eventType = eventTypeByte >> 4;
			event.channel = eventTypeByte & 0x0f;
			event.type = MidiIoEventType.channel;
			switch(eventType) {
				case 0x08:
					event.subtype = MidiIoEventSubtype.noteOff;
					event.noteNumber = param1;
					event.velocity = stream.readInt8();
					return event;
				case 0x09:
					event.noteNumber = param1;
					event.velocity = stream.readInt8();
					if(event.velocity == 0) {
						event.subtype = MidiIoEventSubtype.noteOff;
					} else {
						event.subtype = MidiIoEventSubtype.noteOn;
					}
					return event;
				case 0x0a:
					event.subtype = MidiIoEventSubtype.noteAftertouch;
					event.noteNumber = param1;
					event.amount = stream.readInt8();
					return event;
				case 0x0b:
					event.subtype = MidiIoEventSubtype.controller;
					event.controllerType = param1;
					event.value = stream.readInt8();
					return event;
				case 0x0c:
					event.subtype = MidiIoEventSubtype.programChange;
					event.programNumber = param1;
					return event;
				case 0x0d:
					event.subtype = MidiIoEventSubtype.channelAftertouch;
					event.amount = param1;
					return event;
				case 0x0e:
					event.subtype = MidiIoEventSubtype.pitchBend;
					event.value = param1 + (stream.readInt8() << 7);
					return event;
				default:
					throw new Error(`unrecognised MIDI event type "${eventType}"`);
			}
		}
	}

	function readHeader(stream: ReadStream): MidiIoHeader {
		const headerChunk = readChunk(stream);
		if(headerChunk.id != "MThd" || headerChunk.length != 6) {
			throw new Error("MIDI header not found");
		}
		const headerStream = new ReadStream(headerChunk.data),
			header = {
				formatType: headerStream.readInt16(),
				trackCount: headerStream.readInt16(),
				ticksPerQuarter: headerStream.readInt16()
			};
		if(header.ticksPerQuarter & 0x8000) {
			throw new Error("expressing time division in SMTPE frames is not supported yet");
		}
		return header;
	}

	function readTrack(stream: ReadStream): MidiIoTrack {
		const trackChunk = readChunk(stream);
		if(trackChunk.id != "MTrk") {
			throw new Error(`unexpected chunk: expected MTrk but found "${trackChunk.id}"`);
		}
		const track: MidiIoEvent[] = [],
			trackStream = new ReadStream(trackChunk.data);
		while(!trackStream.eof()) {
			track.push(readEvent(trackStream));
		}
		return track;
	}

	const stream = new ReadStream(data),
		header = readHeader(stream),
		tracks: MidiIoTrack[] = [];
	for(let i = 0; i < header.trackCount; i++) {
		tracks.push(readTrack(stream));
	}
	return {
		header,
		tracks
	};
}

export function parseMidiFile(path: string): MidiIoSong {
	const buffer = readFileSync(path, {encoding: "binary"});
	return parseMidiBuffer(buffer);
}
