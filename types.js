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
 * @property {Number|undefined} channel
 * @property {string|undefined} data
 * @property {Number} deltaTime
 * @property {Number|undefined} denominator
 * @property {Number|undefined} key
 * @property {Number|undefined} noteNumber
 * @property {Number|undefined} numerator
 * @property {Number|undefined} programNumber
 * @property {Number} scale
 * @property {"controller"|"endOfTrack"|"instrumentName"|"keySignature"|"marker"|"noteOff"|"noteOn"|"programChange"|"setTempo"|"timeSignature"|"trackName"|"unknown"}
 *     subtype
 * @property {string|undefined} text
 * @property {"channel"|"meta"} type
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
