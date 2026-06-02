import { Schema , type } from '@colyseus/schema';
import Entity from '../Entity.js';

const defaultView = 1500;

export default class CameraEntity extends Schema {
  @type("number") public viewport: number = defaultView;
  @type("number") public viewZ: number = defaultView;

  @type("number") public scaler = 30;

  public constructor(protected root: Entity) {
    super();
    this.root = root;
  }

  public setScaler(z: number) {
    this.scaler = z;
    return this;
  }

  public setViewport(z: number, apply: boolean = true) {
    this.viewZ = z;
    if(apply) this.viewport = z;
    return this;
  }
};