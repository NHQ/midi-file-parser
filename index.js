/**
 * User: curtis
 * Date: 2019-01-20
 * Time: 14:59
 */
const reader=require("./lib/reader");
const writer=require("./lib/writer");


module.exports={
	parseMidiBuffer: reader.parseMidiBuffer,
	parseMidiFile: reader.parseMidiFile
};
