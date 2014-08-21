const BITS_PER_BYTE = 8;

function BitStream(bits) {
  this.bits = bits;
}

BitStream.fromByteArray = function(array) {
  var bits = [ ];
  var capacity = array.length * BITS_PER_BYTE;

  for (var i = 0; i < capacity; i++) {
    var byteIndex = Math.floor(i / BITS_PER_BYTE);
    var bitIndex = i % BITS_PER_BYTE;

    bits.push((array[byteIndex] >> bitIndex) & 1);
  }

  return new BitStream(bits);
};

BitStream.fromBuffer = function(buffer) {
  return BitStream.fromByteArray(buffer.toJSON());
};

BitStream.prototype.take = function(count) {
  return new BitStream(this.bits.splice(0, count));
};

BitStream.prototype.toAscii = function() {
  return this.toByteArray().map(function(byte) {
    return String.fromCharCode(byte);
  }).join("");
};

BitStream.prototype.toString = function() {
  return this.bits.reverse().join("");
};

BitStream.prototype.toByteArray = function() {
  var bytes = [ ];

  while (this.bits.length > 0) {
    bytes.push(this.take(BITS_PER_BYTE).toUnsigned());
  }

  return bytes;
};

BitStream.prototype.toSigned = function() {
  var size = this.bits.length - 1;
  var n = this.take(size).toUnsigned();

  if (this.take(1).toUnsigned() > 0) {
    n -= Math.pow(2, size);
  }

  return n;
};

BitStream.prototype.toUnsigned = function() {
  return parseInt(this.toString(), 2);
};

BitStream.prototype.reverse = function() {
  return BitStream.fromByteArray(this.toByteArray().reverse());
};

module.exports = BitStream;
