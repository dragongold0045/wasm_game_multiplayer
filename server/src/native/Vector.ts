import { Schema, type } from '@colyseus/schema';

export default class Vector extends Schema {
  public static readonly ZERO: Vector = new Vector(0, 0);
  public static readonly UP: Vector = new Vector(0, -1);
  public static readonly DOWN: Vector = new Vector(0, 1);
  public static readonly LEFT: Vector = new Vector(-1, 0);
  public static readonly RIGHT: Vector = new Vector(1, 0);

  public static Create(x: number = 0, y: number = 0): Vector {
    return new Vector(x, y);
  }

  public static CreateFromObject(obj: { x: number; y: number }): Vector {
    return new Vector(obj.x, obj.y);
  }

  public static CreateFromArray(arr: [number, number]): Vector {
    if (arr.length !== 2) {
      throw new Error("Array must have exactly two elements");
    }
    return new Vector(arr[0], arr[1]);
  }

  public static CreateFromAngle(angle: number, length: number = 1): Vector {
    return new Vector(length * Math.cos(angle), length * Math.sin(angle));
  }

  public static AngleBetween(v1: Vector, v2: Vector): number {
    const dotProduct = v1.dot(v2);
    const lengthsProduct = v1.length() * v2.length();
    if (lengthsProduct === 0) {
      throw new Error("Cannot calculate angle with zero-length vector");
    }
    return Math.acos(dotProduct / lengthsProduct);
  }

  public static DistanceBetween(v1: Vector, v2: Vector): number {
    return Math.hypot(v2.x - v1.x, v2.y - v1.y);
  }

  @type('float64') public x: number = 0;
  @type('float64') public y: number = 0;

  public constructor(x: number = 0, y: number = 0) {
    super();
    this.x = x;
    this.y = y;
  }

  public set(x: number, y: number): void {
    this.x = x;
    this.y = y;
  }

  public add(vector: Vector): Vector {
    return new Vector(this.x + vector.x, this.y + vector.y);
  }

  public subtract(vector: Vector): Vector {
    return new Vector(this.x - vector.x, this.y - vector.y);
  }

  public multiply(scalar: number): Vector {
    return new Vector(this.x * scalar, this.y * scalar);
  }

  public divide(scalar: number): Vector {
    if (scalar === 0) {
      throw new Error("Cannot divide by zero");
    }
    return new Vector(this.x / scalar, this.y / scalar);
  }

  public length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  public normalize(): Vector {
    const len = this.length();
    if (len === 0) {
      return new Vector(0, 0);
    }
    return new Vector(this.x / len, this.y / len);
  }

  public dot(vector: Vector): number {
    return this.x * vector.x + this.y * vector.y;
  }

  public angleTo(vector: Vector): number {
    return Math.atan2(vector.y - this.y, vector.x - this.x);
  }

  public distanceTo(vector: Vector): number {
    return Math.hypot(vector.x - this.x, vector.y - this.y);
  }

  public toText(): string {
    return `Vector(${this.x.toFixed(2)}, ${this.y.toFixed(2)})`;
  }

  public toString(): string {
    return `Vector(${this.x}, ${this.y})`;
  }

  public setX(x: number) {
    this.x = x;
    return this;
  }

  public setY(y: number) {
    this.y = y;
    return this;
  }
}