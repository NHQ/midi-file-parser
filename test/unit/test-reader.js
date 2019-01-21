/**
 * User: curtis
 * Date: 2019-01-20
 * Time: 15:05
 */

const assert=require("../support/assert");
const {parseMidiFile}=require("../../index");

describe("lib.reader", function() {
	describe("parseMidiFile", function() {
		it("should properly load and parse 'simple.mid'", function() {
			const parsed=parseMidiFile("./test/data/simple.mid");
			assert.deepEqual(parsed.header, {
				"formatType": 1,
				"trackCount": 3,
				"ticksPerBeat": 480
			});
			assert.strictEqual(parsed.tracks[1].filter(event=>event.subtype==="noteOn").length, 4);
			assert.strictEqual(parsed.tracks[2].filter(event=>event.subtype==="noteOn").length, 4);
		});
	});
});

