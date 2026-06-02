import { MapSchema, Schema, type } from "@colyseus/schema";
import Entity from "../../entities/Entity.js";
import { MatchRoom } from "../Room.js";
import { Client } from "colyseus";
import { INPUTS } from "../../conder/enum.js";
import Vector from "../../native/Vector.js";
import Inputs from "../../entities/Features/Inputs.js";

export class PlayerController extends Schema {
  public client: Client;
  public bundleId: string;

  @type("string") public username = "new user";
  @type("string") public id: string;
  @type("string") public controlId: string | null = null;

  public control?: Entity;

  public room: MatchRoom;

  public constructor(room: MatchRoom, client: Client) {
    super();
    this.room = room;
    this.client = client;
    this.id = client.sessionId;
  };

  public onInputs(inputs: INPUTS) {
    if(!(this.control instanceof Entity)) return;
    const { MOVEMENT , MOUSE , KEYBOARD } = inputs;
    // Handle movement inputs
    const { DOWN, LEFT, RIGHT, UP, MOUSEMOVEMENT , MOVING } = MOVEMENT;
    
    if(MOVING) {
      let direction = new Vector();
      if(!MOUSEMOVEMENT) {
        if(DOWN) direction.setY(1);
        else if(UP) direction.setY(-1);
        if(LEFT) direction.setX(-1);
        else if(RIGHT) direction.setX(1);

        if(this.control.inputs instanceof Inputs) {
          this.control.inputs.acceleration = direction.normalize();
        }
      } else {
        if(this.control.inputs instanceof Inputs) {
          direction = Vector.CreateFromAngle(this.control.position.angleTo(this.control.inputs.mouse), Math.min(1, Math.abs(this.control.position.distanceTo(this.control.inputs.mouse)) / 100));
          this.control.inputs.acceleration = direction;
        }
      }
    } else if(this.control.inputs instanceof Inputs) this.control.inputs.acceleration = new Vector;

    // Handle mouse inputs
    if(this.control.inputs instanceof Inputs) {
      this.control.inputs.mouse.setX(this.control.position.x + MOUSE.x);
      this.control.inputs.mouse.setY(this.control.position.y + MOUSE.y);
      this.control.inputs.status = MOUSE.status;
    }
  }

  public setControl(control: Entity) {
    this.control = control;
    control.control = this;
    if(!(control.inputs instanceof Inputs)) control.inputs = new Inputs(control);
    control.relations.name.setName(this.username);
    this.controlId = control.ID;
    this.client.send("control", control.ID);
    return this;
  }

  public setName(name?: string) {
    const id = Math.floor(Math.random() * 10000);
    this.username = name || `quest#${id < 10000 ? id.toString() + "0" : id}`;
    if(this.control) {
      this.control.relations.name.setName(this.username);
    }
    return this;
  }

  public setBundleId(bundleId: string) {
    this.bundleId = bundleId;
    return this;
  }

  public onRemove() {
    if(this.control instanceof Entity) {
      this.control.kill();
      this.room.state.entities.delete(this.control.ID);
    }
  }
};

export class PlayerControllerManager extends MapSchema<PlayerController> {
  public delete(key: string): boolean {
    if(this.has(key)) {
      const value = this.get(key);
      value.onRemove();
      return super.delete(key);
    }
    return true; // deleted
  }
}