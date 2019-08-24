/**
 * User: curtis
 * Date: 2019-01-20
 * Time: 15:05
 */

const assert=require("../support/assert");
const fs=require("fs");
const {
	parseMidiBuffer,
	parseMidiFile,
	writeMidiToBuffer,
	writeMidiToFile
}=require("../../dist");

/**
 * @param {string} read
 * @param {Buffer} write
 */
function compareBuffers(read, write) {
	/* eslint-disable no-console */
	try {
		assert.strictEqual(write.toString("binary"), read.toString());
	} catch(error) {
		console.info("read and write buffers do not match");
		console.info("index  r   w ");
		for(let index=0; index<write.length; index++) {
			let rc=read.charCodeAt(index),
				wc=write[index],
				prefix=`${((rc===wc) ? " " : "*")}${index}`;
			console.info(`${assert.format(prefix, 4)} ${assert.format(rc.toString(16), 3)} ${assert.format(wc.toString(16), 3)}  [${read[index]}]`);
		}
		throw error;
	}
}

describe("lib.writer", function() {
	describe("writeMidiToBuffer", function() {
		it("should properly load and parse 'simple.mid'", function() {
			const readBuffer=fs.readFileSync("./test/data/simple.mid", {encoding: "binary"}),
				parsed=parseMidiBuffer(readBuffer),
				writeBuffer=writeMidiToBuffer(parsed);
			compareBuffers(readBuffer, writeBuffer);
		});
	});

	describe("writeMidiToFile", function() {
		it("should properly load and parse 'simple.mid'", function() {
			const readBuffer=fs.readFileSync("./test/data/simple.mid", {encoding: "binary"}),
				parsed=parseMidiBuffer(readBuffer);
			writeMidiToFile(parsed, "./test/data/out.mid");
			compareBuffers(readBuffer, fs.readFileSync("./test/data/out.mid", {encoding: "binary"}));
		});
	});
});

