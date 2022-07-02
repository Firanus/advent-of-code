export enum ParameterMode {
  Position,
  Immediate,
}

export interface Parameter {
  mode: ParameterMode;
  address: number;
}
