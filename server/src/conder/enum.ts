export type INPUTS = {
  MOVEMENT: {
    DOWN: boolean;
    UP: boolean;
    LEFT: boolean;
    RIGHT: boolean;
    MOUSEMOVEMENT: boolean;
    MOVING: boolean;
  },
  MOUSE: {
    x: number;
    y: number;
    status: ("defense" | "attack")[]
  };
  KEYBOARD: Map<string, boolean>; // e.g. "w", "a", "s", "d"
}

export enum ENTITIES {
  ENTITY,
  ZOMBIE,

  AUTO_TURRET
}