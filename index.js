/**
 * User: curtis
 * Date: 2019-01-20
 * Time: 14:59
 */

const {parseMidiBuffer, parseMidiFile}=require("./lib/reader");
const {writeMidiToBuffer, writeMidiToFile}=require("./lib/writer");


module.exports={
	parseMidiBuffer,
	parseMidiFile,
	writeMidiToBuffer,
	writeMidiToFile
};
