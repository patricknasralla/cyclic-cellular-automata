import { NEIGHBOURHOOD } from '../model/model';

export const CCAREACT_DEFAULTS_1 = {
  width:         100,
  height:        100,
  threshold:     3,
  states:        7,
  neighbourhood: NEIGHBOURHOOD.MOORE,
  nSize:         2,
};

export const CCAREACT_DEFAULTS_2 = {
  width:         200,
  height:        100,
  threshold:     3,
  states:        7,
  neighbourhood: NEIGHBOURHOOD.MOORE,
  nSize:         2,
};


export interface GPUDefaults {
  states:        number
  threshold:     number
  nSize:         number
  neighbourhood: boolean
}

export const GPU_DEFAULTS = {
  states:        25,
  threshold:     2,
  nSize:         2,
  neighbourhood: true,
};

export const PBR_DEFAULTS = {
  states:        3,
  threshold:     36,
  nSize:         4,
  neighbourhood: true,
};
