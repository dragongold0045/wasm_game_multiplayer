import { INPUTS } from "../outside_type";

export default {
  KEYBOARD: new Map(),
  MOVEMENT: {
    UP: false,
    DOWN: false,
    LEFT: false,
    RIGHT: false,
    MOUSEMOVEMENT: false,
    MOVING: true,
  },
  MOUSE: {
    x: 0,
    y: 0,
    status: [],
  }
} as INPUTS;