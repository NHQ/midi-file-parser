/**
 * Date: 8/22/19
 * Time: 9:27 PM
 * @license MIT (see project's LICENSE file)
 */


export class WriteStream {
	public buffer: Buffer = Buffer.alloc(0);

	get length(): number {
		return this.buffer.length;
	}

	/**
	 * Appends data just as it is to our buffer
	 */
	write(data: Buffer|WriteStream|string): void {
		if(data instanceof Buffer) {
			this.buffer = Buffer.concat([this.buffer, data]);
		} else if(data instanceof WriteStream) {
			this.buffer = Buffer.concat([this.buffer, data.buffer]);
		} else {
			this.buffer = Buffer.concat([this.buffer, Buffer.from(data)]);
		}
	}

	/**
	 * Writes 8 bit value to our buffer
	 */
	writeInt8(value: number): void {
		const buffer = Buffer.alloc(1);
		buffer.writeUInt8(value, 0);
		this.buffer = Buffer.concat([this.buffer, buffer]);
	}

	/**
	 * Writes 16 bit int to our buffer
	 */
	writeInt16(value: number): void {
		const buffer = Buffer.alloc(2);
		buffer.writeInt16BE(value, 0);
		this.buffer = Buffer.concat([this.buffer, buffer]);
	}

	/**
	 * Writes 32 bit int to our buffer
	 */
	writeInt32(value: number): void {
		const buffer = Buffer.alloc(4);
		buffer.writeInt32BE(value, 0);
		this.buffer = Buffer.concat([this.buffer, buffer]);
	}

	/**
	 * Writes a variable-length integer: a big-endian value in groups of 7 bits with top bit set to signify that another byte follows
	 */
	writeVarInt(value: number): void {
		const stack: number[] = [];
		do {
			stack.push(value & 0x7f);
			value = value >> 7;
		} while(value !== 0);
		for(let index = stack.length - 1; index > -1; index--) {
			this.writeInt8((index > 0) ? stack[index] | 0x80 : stack[index]);
		}
	}
}
