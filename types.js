/**
 * User: curtis
 * Date: 10/31/18
 * Time: 1:48 AM
 */

/**
 * @typedef {Object} MidiHeader
 * @property {Number} formatType
 * @property {Number} trackCount
 * @property {Number} ticksPerBeat
 */

/**
 * @typedef {Object} MidiEvent
 * @property {Number|undefined} amount
 * @property {Number|undefined} channel
 * @property {Number|undefined} controllerType
 * @property {string|undefined} data
 * @property {Number} deltaTime
 * @property {Number|undefined} denominator
 * @property {Number|undefined} hour
 * @property {Number|undefined} frame
 * @property {Number|undefined} key
 * @property {Number|undefined} metronome
 * @property {Number|undefined} microsecondsPerBeat
 * @property {Number|undefined} min
 * @property {Number|undefined} noteNumber
 * @property {Number|undefined} numerator
 * @property {Number|undefined} programNumber
 * @property {Number|undefined} scale
 * @property {Number|undefined} sec
 * @property {Number|undefined} subframe
 * @property {"controller"|"endOfTrack"|"instrumentName"|"keySignature"|"marker"|"noteOff"|"noteOn"|"programChange"|"setTempo"|"timeSignature"|"trackName"|"unknown"} subtype
 * @property {string|undefined} text
 * @property {Number|undefined} thirtyseconds
 * @property {"channel"|"meta"|"sysEx"|"dividedSysEx"} type
 * @property {Number|undefined} value
 * @property {Number|undefined} velocity
 */

/**
 * @typedef {Array<MidiEvent>} MidiTrack
 */

/**
 * @typedef {Object} MidiFile
 * @property {MidiHeader} header
 * @property {Array<MidiTrack>} tracks
 */
