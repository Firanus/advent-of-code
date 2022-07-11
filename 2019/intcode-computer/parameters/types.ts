export enum ParameterMode {
  Position,
  Immediate,
  Relative,
}

export interface Parameter {
  mode: ParameterMode;
  address: number;
  relativeBase: number;
}
