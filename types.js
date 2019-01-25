/**
 * User: curtis
 * Date: 10/31/18
 * Time: 1:48 AM
 */

/**
 * @typedef {"channel"|"meta"|"sysEx"|"dividedSysEx"} MidiIoEventType
 */

/**
 * @typedef {"controller"|"endOfTrack"|"instrumentName"|"keySignature"|"marker"|"noteOff"|"noteOn"|"programChange"|"setTempo"|"timeSignature"|"trackName"|"unknown"} MidiIoEventSubtype
 */


/**
 * @typedef {Object} MidiIoHeader
 * @property {number} formatType
 * @property {number} trackCount
 * @property {number} ticksPerBeat
 */

/**
 * @typedef {Object} MidiIoEvent
 * @property {number|undefined} amount
 * @property {number|undefined} channel
 * @property {number|undefined} controllerType
 * @property {string|undefined} data
 * @property {number} deltaTime
 * @property {number|undefined} denominator
 * @property {number|undefined} hour
 * @property {number|undefined} frame
 * @property {number|undefined} key
 * @property {number|undefined} metronome
 * @property {number|undefined} microsecondsPerBeat
 * @property {number|undefined} min
 * @property {number|undefined} noteNumber
 * @property {number|undefined} numerator
 * @property {number|undefined} programNumber
 * @property {number|undefined} scale
 * @property {number|undefined} sec
 * @property {number|undefined} subframe
 * @property {MidiIoEventSubtype} subtype
 * @property {string|undefined} text
 * @property {number|undefined} thirtyseconds
 * @property {MidiIoEventType} type
 * @property {number|undefined} value
 * @property {number|undefined} velocity
 */

/**
 * @typedef {Array<MidiIoEvent>} MidiIoTrack
 */

/**
 * @typedef {Object} MidiIoSong
 * @property {MidiIoHeader} header
 * @property {Array<MidiIoTrack>} tracks
 */
