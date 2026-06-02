import { Schema , type } from "@colyseus/schema";
import Entity from "../Entity.js";

type CollisionType = "all" | "team" | "enemy" | "owner" | "without-owner";

export default class Collide extends Schema {
  protected root: Entity;

  @type("boolean") public enabled: boolean = true; // Whether collision detection is enabled

  @type("number") public knockback: number = 1000; // Knockback force applied on collision

  public collisionWithMap: boolean = true; // Whether to check collisions with the map
  public collisionMapWithSize = true; // Whether to consider the size of the map in collision detection

  public collisionType: CollisionType = "all";

  public constructor(root: Entity) {
    super();
    this.root = root;
  }

  public setKnockback(knockback: number): this {
    this.knockback = knockback;
    return this;
  }

  public setCollisionType(type: CollisionType): this {
    this.collisionType = type;
    return this;
  }

  public conditionCollision(target: Entity): boolean {
    if(!this.enabled) return false;
    return true;
  }
};