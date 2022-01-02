const path = require("path");
const fs = require("fs");

fs.readFile(path.resolve(__dirname, "./input.txt"), "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  const hexadecimal = data;
  const toplevelPacketString = processHexadecimalStringToPacket(hexadecimal);
  const packet = processPacket(toplevelPacketString);

  // For Part 1:
  // const versionSum = calculateVersionSum(packet);
  // console.log(versionSum)

  // For Part 2:
  console.log(packet.value);
});

// Return type of packet:
// interface Packet {
//    packetString: string
//    version: number
//    typeId: number
//    literalValueString: string | undefined
//    value: number
//    lengthTypeId = number | undefined
//    subpackets: Packet[]
// }
const processPacket = (packetString) => {
  const version = parseInt(packetString.slice(0, 3), 2);
  const typeId = parseInt(packetString.slice(3, 6), 2);

  const packet = {
    packetString,
    version,
    typeId,
  };

  if (isLiteralPacket(packet)) {
    processLiteralPacket(packet);
  } else {
    processOperatorPacket(packet);
  }

  return packet;
};

const processMultiplePacketsWhenPacketCountSpecified = (
  packetString,
  packetCount
) => {
  let remainingPacketString = packetString;
  const packets = [];
  while (packets.length < packetCount) {
    const packet = processPacket(remainingPacketString);
    packets.push(packet);
    let processedPacketString = packet.packetString;
    remainingPacketString = remainingPacketString.slice(
      processedPacketString.length
    );
  }
  return packets;
};

const processMultiplePacketsWhenTotalBitLengthSpecified = (
  packetString,
  totalBitLength
) => {
  let remainingPacketString = packetString;
  const packets = [];
  while (
    packets.reduce((acc, curr) => acc + curr.packetString.length, 0) <
    totalBitLength
  ) {
    const packet = processPacket(remainingPacketString);
    packets.push(packet);
    let processedPacketString = packet.packetString;
    remainingPacketString = remainingPacketString.slice(
      processedPacketString.length
    );
  }
  return packets;
};

const processHexadecimalStringToPacket = (hexadecimal) => {
  const hexadecimalCharacters = hexadecimal.split("");
  let binaryRep = "";
  for (let i = 0; i < hexadecimalCharacters.length; i++) {
    const hexChar = hexadecimalCharacters[i];
    binaryRep += parseInt(hexChar, 16).toString(2).padStart(4, "0");
  }

  return binaryRep;
};

const processLiteralPacket = (packet) => {
  const { packetString } = packet;
  let endReached = false;
  let literalValueString = "";
  let index = 6;

  while (!endReached) {
    let nextGroup = packetString.slice(index, index + 5);
    if (nextGroup.slice(0, 1) === "0") {
      endReached = true;
    }
    literalValueString += nextGroup.slice(1);
    index += 5;
  }
  let literalValue = parseInt(literalValueString, 2);

  packet.literalValueString = literalValueString;
  packet.value = literalValue;
  packet.subpackets = [];

  // Slim down packetString to relevant characters after processing
  packet.packetString = packetString.slice(0, index);
};

const processOperatorPacket = (packet) => {
  const { packetString } = packet;
  packet.lengthTypeId = parseInt(packetString.slice(6, 7), 2);

  if (isTotalBitLengthOfSubpacketsSpecified(packet)) {
    const bitLengthOfSubpackets = parseInt(packetString.slice(7, 22), 2);
    const remainingPacketString = packetString.slice(22);
    const subpackets = processMultiplePacketsWhenTotalBitLengthSpecified(
      remainingPacketString,
      bitLengthOfSubpackets
    );
    packet.subpackets = subpackets;
    packet.packetString = packetString.slice(0, 22 + bitLengthOfSubpackets);
  } else {
    const numberOfSubpackets = parseInt(packetString.slice(7, 18), 2);
    const remainingPacketString = packetString.slice(18);
    const subpackets = processMultiplePacketsWhenPacketCountSpecified(
      remainingPacketString,
      numberOfSubpackets
    );
    packet.subpackets = subpackets;
    packet.packetString = packetString.slice(
      0,
      18 + subpackets.reduce((acc, curr) => acc + curr.packetString.length, 0)
    );
  }

  if (isOperatorSumPacket(packet)) {
    packet.value = packet.subpackets.reduce((acc, curr) => acc + curr.value, 0);
  } else if (isOperatorProductPacket(packet)) {
    packet.value = packet.subpackets.reduce((acc, curr) => acc * curr.value, 1);
  } else if (isOperatorMinimumPacket(packet)) {
    packet.value = packet.subpackets.reduce(
      (acc, curr) => (acc < curr.value ? acc : curr.value),
      100000000000
    );
  } else if (isOperatorMaximumPacket(packet)) {
    packet.value = packet.subpackets.reduce(
      (acc, curr) => (acc > curr.value ? acc : curr.value),
      -1
    );
  } else if (isOperatorGreaterThanPacket(packet)) {
    packet.value =
      packet.subpackets[0].value > packet.subpackets[1].value ? 1 : 0;
  } else if (isOperatorLessThanPacket(packet)) {
    packet.value =
      packet.subpackets[0].value < packet.subpackets[1].value ? 1 : 0;
  } else {
    packet.value =
      packet.subpackets[0].value == packet.subpackets[1].value ? 1 : 0;
  }

  return packet;
};

const calculateVersionSum = (packet) => {
  let versionSum = packet.version;
  for (let i = 0; i < packet.subpackets.length; i++) {
    versionSum += calculateVersionSum(packet.subpackets[i]);
  }
  return versionSum;
};

const isLiteralPacket = ({ typeId }) => typeId === 4;
const isOperatorSumPacket = ({ typeId }) => typeId === 0;
const isOperatorProductPacket = ({ typeId }) => typeId === 1;
const isOperatorMinimumPacket = ({ typeId }) => typeId === 2;
const isOperatorMaximumPacket = ({ typeId }) => typeId === 3;
const isOperatorGreaterThanPacket = ({ typeId }) => typeId === 5;
const isOperatorLessThanPacket = ({ typeId }) => typeId === 6;

const isTotalBitLengthOfSubpacketsSpecified = ({ lengthTypeId }) =>
  lengthTypeId === 0;
const isNumberOfSubpacketsSpecified = ({ lengthTypeId }) => lengthTypeId === 1;
