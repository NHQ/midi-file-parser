/**
 * User: curtis
 * Date: 2019-01-20
 * Time: 15:05
 */

const assert=require("../support/assert");
const {parseMidiFile}=require("../../dist");

describe("lib.reader", function() {
	describe("parseMidiFile", function() {
		it("should properly load and parse 'simple.mid'", function() {
			const parsed=parseMidiFile("./test/data/simple.mid");
			assert.deepEqual(parsed.header, {
				"formatType": 1,
				"trackCount": 3,
				"ticksPerQuarter": 480
			});
			assert.deepEqual(parsed, {
				"header": {
					"formatType": 1,
					"trackCount": 3,
					"ticksPerQuarter": 480
				},
				"tracks": [
					[
						{
							"deltaTime": 0,
							"subtype": "timeSignature",
							"type": "meta",
							"numerator": 4,
							"denominator": 4,
							"metronome": 24,
							"thirtyseconds": 8
						},
						{
							"deltaTime": 0,
							"subtype": "keySignature",
							"type": "meta",
							"key": 0,
							"scale": 0
						},
						{
							"deltaTime": 0,
							"subtype": "smpteOffset",
							"type": "meta",
							"frameRate": 25,
							"hour": 1,
							"min": 0,
							"sec": 0,
							"frame": 0,
							"subframe": 0
						},
						{
							"deltaTime": 0,
							"subtype": "setTempo",
							"type": "meta",
							"microsecondsPerBeat": 500000
						},
						{
							"deltaTime": 3840000,
							"subtype": "endOfTrack",
							"type": "meta"
						}
					],
					[
						{
							"deltaTime": 0,
							"subtype": "midiChannelPrefix",
							"type": "meta",
							"channel": 15
						},
						{
							"deltaTime": 0,
							"subtype": "trackName",
							"type": "meta",
							"text": "Classic Electric Piano"
						},
						{
							"deltaTime": 0,
							"subtype": "instrumentName",
							"type": "meta",
							"text": "track 1"
						},
						{
							"deltaTime": 0,
							"subtype": "noteOn",
							"channel": 0,
							"type": "channel",
							"noteNumber": 48,
							"velocity": 80
						},
						{
							"deltaTime": 480,
							"subtype": "noteOff",
							"channel": 0,
							"type": "channel",
							"noteNumber": 48,
							"velocity": 64
						},
						{
							"deltaTime": 480,
							"subtype": "noteOn",
							"channel": 0,
							"type": "channel",
							"noteNumber": 50,
							"velocity": 80
						},
						{
							"deltaTime": 480,
							"subtype": "noteOff",
							"channel": 0,
							"type": "channel",
							"noteNumber": 50,
							"velocity": 64
						},
						{
							"deltaTime": 480,
							"subtype": "noteOn",
							"channel": 0,
							"type": "channel",
							"noteNumber": 52,
							"velocity": 80
						},
						{
							"deltaTime": 480,
							"subtype": "noteOff",
							"channel": 0,
							"type": "channel",
							"noteNumber": 52,
							"velocity": 64
						},
						{
							"deltaTime": 480,
							"subtype": "noteOn",
							"channel": 0,
							"type": "channel",
							"noteNumber": 53,
							"velocity": 80
						},
						{
							"deltaTime": 480,
							"subtype": "noteOff",
							"channel": 0,
							"type": "channel",
							"noteNumber": 53,
							"velocity": 64
						},
						{
							"deltaTime": 480,
							"subtype": "endOfTrack",
							"type": "meta"
						}
					],
					[
						{
							"deltaTime": 0,
							"subtype": "midiChannelPrefix",
							"type": "meta",
							"channel": 15
						},
						{
							"deltaTime": 0,
							"subtype": "trackName",
							"type": "meta",
							"text": "Classic Electric Piano"
						},
						{
							"deltaTime": 0,
							"subtype": "instrumentName",
							"type": "meta",
							"text": "track 2"
						},
						{
							"deltaTime": 480,
							"subtype": "noteOn",
							"channel": 0,
							"type": "channel",
							"noteNumber": 47,
							"velocity": 80
						},
						{
							"deltaTime": 240,
							"subtype": "noteOff",
							"channel": 0,
							"type": "channel",
							"noteNumber": 47,
							"velocity": 64
						},
						{
							"deltaTime": 720,
							"subtype": "noteOn",
							"channel": 0,
							"type": "channel",
							"noteNumber": 47,
							"velocity": 80
						},
						{
							"deltaTime": 240,
							"subtype": "noteOff",
							"channel": 0,
							"type": "channel",
							"noteNumber": 47,
							"velocity": 64
						},
						{
							"deltaTime": 720,
							"subtype": "noteOn",
							"channel": 0,
							"type": "channel",
							"noteNumber": 47,
							"velocity": 80
						},
						{
							"deltaTime": 240,
							"subtype": "noteOff",
							"channel": 0,
							"type": "channel",
							"noteNumber": 47,
							"velocity": 64
						},
						{
							"deltaTime": 720,
							"subtype": "noteOn",
							"channel": 0,
							"type": "channel",
							"noteNumber": 47,
							"velocity": 80
						},
						{
							"deltaTime": 240,
							"subtype": "noteOff",
							"channel": 0,
							"type": "channel",
							"noteNumber": 47,
							"velocity": 64
						},
						{
							"deltaTime": 240,
							"subtype": "endOfTrack",
							"type": "meta"
						}
					]
				]
			});
		});
	});
});

