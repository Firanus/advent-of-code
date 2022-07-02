export const processInstructionCode = (
  instructionCode: number
): { opCode: number; parameterCodes: number[] } => {
  const instructionCodeString = instructionCode.toString();

  let opCodeString = "";
  let paramCodesString = "";

  if (instructionCodeString.length < 3) {
    opCodeString = instructionCodeString;
  } else {
    opCodeString = instructionCodeString.slice(
      instructionCodeString.length - 2
    );
    paramCodesString = instructionCodeString.slice(
      0,
      instructionCodeString.length - 2
    );
  }

  const opCode = parseInt(opCodeString, 10);
  const parameterCodes = paramCodesString
    .split("")
    .reverse()
    .map((code) => parseInt(code, 10));

  return { opCode, parameterCodes };
};
