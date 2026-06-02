import { Schema, type } from '@colyseus/schema';

type HealthFlags = "visible" | "invisible";

export default class Health extends Schema {
  public static readonly MAX_DEFAULT_HEALTH: number = 100;
  public static readonly MIN_DEFAULT_HEALTH: number = 0;

  @type("string") public flag: HealthFlags = "visible"; // Flag for health changes, can be used for animations or effects

  @type("float64") public value: number = Health.MAX_DEFAULT_HEALTH;
  @type("float64") public max: number = Health.MAX_DEFAULT_HEALTH;
  @type("float64") public min: number = Health.MIN_DEFAULT_HEALTH;

  public constructor(value?: number) {
    super();
    if (value !== undefined) this.setValue(value);
  }

  public setFlag(flag: HealthFlags) {
    this.flag = flag;
    return this;
  }

  public isAlive(): boolean {
    return this.value > this.min;
  }

  public VALUE(value: number) {
    this.value = Math.max(this.min, Math.min(this.max, value));
    return this;
  }

  public MAX(max: number) {
    this.max = Math.max(this.min, max);
    return this;
  }

  public MIN(min: number) {
    this.min = Math.min(this.max, min);
    return this;
  }

  public setValue(value: number) {
    this.MAX(value).VALUE(value);
    return this;
  }
};