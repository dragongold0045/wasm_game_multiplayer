import { Schema , type } from "@colyseus/schema";
import Vector from "../../native/Vector.js";
import Entity from "../Entity.js";
import { INPUTS } from "../../conder/enum.js";

export default class Inputs extends Schema {
  @type(Vector) public acceleration: Vector = new Vector(0, 0); // Acceleration vector for the entity
  @type(Vector) public mouse: Vector = new Vector(0, 0); // Mouse position vector for the entity

  @type(["string"]) public status: INPUTS["MOUSE"]["status"] = [];

  @type("float64") public speedMovement: number = 10; // Speed of movement for the entity

  public constructor(protected root: Entity) {
    super();
    this.root = root;
  }

  public controllingRotation = true;

  public tick(delta: number) {
    this.root.velocity = this.root.velocity.add(this.acceleration.multiply(this.speedMovement));
    if (this.controllingRotation) {
      this.root.physics.angle = this.root.position.angleTo(this.mouse);
    }
  }
}