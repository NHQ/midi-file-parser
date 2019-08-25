/**
 * User: curtis
 * Date: 10/31/18
 * Time: 1:48 AM
 */

export enum MidiFileType {
	/**
	 * contains a single track
	 */
	SINGLE = 0,
	/**
	 * contains one or more simultaneous (as in played simultaneously) tracks
	 */
	SIMULTANEOUS = 1,
	/**
	 * contains one or more independent (as in played independently) tracks
	 */
	INDEPENDENT =2
}

export enum MidiIoEventType {
	channel = "channel",
	meta = "meta",
	sysEx = "sysEx",
	dividedSysEx = "dividedSysEx"
}

export enum MidiIoEventSubtype {
	channelAftertouch = "channelAftertouch",
	controller = "controller",
	copyrightNotice = "copyrightNotice",
	cuePoint = "cuePoint",
	endOfTrack = "endOfTrack",
	instrumentName = "instrumentName",
	keySignature = "keySignature",
	lyrics = "lyrics",
	marker = "marker",
	midiChannelPrefix = "midiChannelPrefix",
	noteAftertouch = "noteAftertouch",
	noteOff = "noteOff",
	noteOn = "noteOn",
	pitchBend = "pitchBend",
	programChange = "programChange",
	setTempo = "setTempo",
	sequenceNumber = "sequenceNumber",
	sequencerSpecific = "sequencerSpecific",
	smpteOffset = "smpteOffset",
	timeSignature = "timeSignature",
	trackName = "trackName",
	text = "text",
	unknown = "unknown"
}

export interface MidiIoHeader {
	formatType: MidiFileType,
	trackCount: number,
	ticksPerQuarter: number
}

export interface MidiIoEvent {
	amount?: number,
	channel?: number,
	controllerType?: number,
	data?: string,
	deltaTime: number,
	denominator?: number,
	hour?: number,
	frame?: number,
	frameRate?: number,
	key?: number,
	metronome?: number,
	microsecondsPerBeat?: number,
	min?: number,
	noteNumber?: number,
	number?: number,
	numerator?: number,
	programNumber?: number,
	scale?: number,
	sec?: number,
	subframe?: number,
	subtype: MidiIoEventSubtype,
	text?: string,
	thirtyseconds?: number,
	type: MidiIoEventType,
	value?: number,
	velocity?: number
}

export interface MidiIoSong {
	header: MidiIoHeader,
	tracks: MidiIoTrack[]
}

export type MidiIoTrack = MidiIoEvent[];

