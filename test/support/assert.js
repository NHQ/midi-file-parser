/**
 * User: curt
 * Date: 3/5/2018
 * Time: 9:10 PM
 */

const assert=require("assert");

// mixin the guys that we like
exports.deepStrictEqual=assert.deepStrictEqual;
exports.doesNotThrow=assert.doesNotThrow;
exports.equal=assert.equal;
exports.ifError=assert.ifError;
exports.notDeepEqual=assert.notDeepEqual;
exports.notEqual=assert.notEqual;
exports.notStrictEqual=assert.notStrictEqual;
exports.ok=assert.ok;
exports.strictEqual=assert.strictEqual;
exports.throws=assert.throw;

/**
 * We print out the expected as, in here at least, we frequently want to steal it.
 * @param {*} actual
 * @param {*} expected
 * @throws {Error}
 */
exports.deepEqual=function(actual, expected) {
	try {
		assert.deepEqual(actual, expected);
	} catch(error) {
		console.error(`assert.deepEqual() failed: actual=\n${JSON.stringify(actual, null, "\t")}`);
		throw error;
	}
};

/**
 * macro for assert.ok(false, error)
 * @param {Error|string} error
 */
exports.fail=(error)=>{
	// note: we convert it to a string (if an error) so that the assert library doesn't just throw him
	exports.ok(false, error.toString());
};
