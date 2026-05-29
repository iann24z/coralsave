function crc16ccitt(str: string): string {
  let crc = 0xFFFF;
  for (let i = 0; i < str.length; i++) {
    const charCode = str.charCodeAt(i);
    let x = ((crc >> 8) ^ charCode) & 0xFF;
    x ^= x >> 4;
    crc = ((crc << 8) ^ (x << 12) ^ (x << 5) ^ x) & 0xFFFF;
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

const candidate = "00020101021126570016ID1020221319760010303UMI51440014ID102022131976020303UMI5204541153033605802ID5912NABUNYUK CO6015KOTA YOGYAKART61055518262070703A016304";
console.log('Result:', candidate + crc16ccitt(candidate));
console.log('Computed CRC:', crc16ccitt(candidate));
