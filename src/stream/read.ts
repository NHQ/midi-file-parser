/**
 * Date: 8/22/19
 * Time: 9:27 PM
 * @license MIT (see project's LICENSE file)
 */

/**
 * Wrapper for accessing strings through sequential reads
 */
export class ReadStream {
	private buffer: string;
	private position: number = 0;

	constructor(buffer: string) {
		this.buffer = buffer;
	}

	read(length: number): string {
		const result = this.buffer.substr(this.position, length);
		this.position += length;
		return result;
	}

	/* read a big-endian 32-bit integer */
	readInt32(): number {
		const result = (
			(this.buffer.charCodeAt(this.position) << 24)
			+ (this.buffer.charCodeAt(this.position + 1) << 16)
			+ (this.buffer.charCodeAt(this.position + 2) << 8)
			+ this.buffer.charCodeAt(this.position + 3));
		this.position += 4;
		return result;
	}

	/* read a big-endian 16-bit integer */
	readInt16(): number {
		const result =
			(this.buffer.charCodeAt(this.position) << 8)
			+ this.buffer.charCodeAt(this.position + 1);
		this.position += 2;
		return result;
	}

	/* read an 8-bit integer */
	readInt8(signed: boolean = false): number {
		let result = this.buffer.charCodeAt(this.position);
		if(signed && result > 127) {
			result -= 256;
		}
		this.position += 1;
		return result;
	}

	eof(): boolean {
		return this.position >= this.buffer.length;
	}

	/**
	 * read a MIDI-style variable-length integer (big-endian value in groups of 7 bits,
	 * with top bit set to signify that another byte follows)
	 */
	readVarInt(): number {
		var result = 0;
		while(true) {
			var b = this.readInt8();
			if(b & 0x80) {
				result += (b & 0x7f);
				result <<= 7;
			} else {
				/* b is the last byte */
				return result + b;
			}
		}
	}

}
