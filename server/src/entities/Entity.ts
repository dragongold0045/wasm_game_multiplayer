import { Schema , type } from "@colyseus/schema";
import Vector from "../native/Vector.js";
import { MatchRoom } from "../rooms/Room.js";
import Inputs from "./Features/Inputs.js";
import TeamEntity from "./Features/TeamEntity.js";
import NameEntity from "./Features/NameEntity.js";
import Health from "./Features/Health.js";
import { nanoid } from "nanoid";
import { PlayerController } from "../rooms/schema/PlayerController.js";
import Collide from "./Features/Collide.js";
import CameraEntity from "./Features/CameraEntity.js";
import { ENTITIES } from "../conder/enum.js";

class Physics extends Schema {
  @type("float64") public mass: number = 80;
  @type("float64") public size: number = 30;
  @type("float64") public armor: number = 1;
  @type("float64") public angle: number = Math.PI*2*Math.random();
  @type("float64") public friction: number = 0.06;
  @type("float64") public bodyDamage: number = 0;
};

class Relations extends Schema {
  @type("string") public rootId: string;
  @type("string") public ownerId: string;
  @type(NameEntity) public name: NameEntity = new NameEntity();
  @type(TeamEntity) public team: TeamEntity;
  @type("boolean") public invisible = false;

  public canBeTarget: boolean = true;

  public constructor(root: Entity) {
    super();

    this.team = root.room.state.teams.get("unnamed") || new TeamEntity(root.room, "unnamed", "#ffffff");
  }

  public owner: Entity; // current owner
  public root: Entity; // base owner
}

export default class Entity extends Schema {
  @type("string") public readonly ID = nanoid();

  @type("number") public TYPE = ENTITIES.ENTITY;

  @type(Vector) public position = new Vector;

  @type(Physics) public physics = new Physics;

  @type(Relations) public relations: Relations;

  @type(Inputs) public inputs: Inputs | null = null;

  @type(Health) public health: Health | null = null;

  @type(Collide) public collide = new Collide(this);

  @type(Vector) public velocity = new Vector;

  @type(CameraEntity) public camera = new CameraEntity(this);

  @type("boolean") public died = false;

  public control?: PlayerController;

  public room: MatchRoom;

  public constructor(room: MatchRoom) {
    super();

    this.room = room;

    this.relations = new Relations(this);
  }

  // adding to room
  public onAdd() {

  }
  // removing from room
  public onDelete() {

  }

  // it can be respawn not instantly remove from room
  public onSpawn() {}

  // somethigns could happen that not remove instantly from room
  public onDied() {}

  // kill the entity but might not instatly
  public kill() {
    if(this.health instanceof Health) this.health.VALUE(this.health.min);
    this.died = true;
    this.onDied();
    this.room.state.entities.delete(this.ID);
  }
  
  // instantly killing
  public readonly instantKill = () => {
    if(this.health instanceof Health) this.health.VALUE(this.health.min);
    this.died = true;
    this.onDied();
    this.room.state.entities.delete(this.ID);
  }

  // spawning entity
  public spawn() {
    this.init();
    this.onSpawn();
    console.log("An entity has been spawned!");
    this.room.state.entities.set(this.ID, this);
  };

  // init entity before spawning
  protected init() {
    // this.velocity = Vector.CreateFromAngle(Math.PI*2*Math.random(), 400);
  }

  // check that if entity existed
  public existed() {
    return this.room.state.entities.has(this.ID);
  }

  // set owner for entity
  public setOwner(owner: Entity) {
    this.relations.owner = owner;
    this.relations.ownerId = owner.ID;
    const getWorldRoot = (owner: Entity): Entity => owner.relations.owner instanceof Entity ? getWorldRoot(owner.relations.owner) : owner;

    this.relations.root = getWorldRoot(owner);
    this.relations.rootId = this.relations.root.ID;
    this.relations.team = this.relations.root.relations.team;
  };

  // get the hitbox where myterious entity damaging
  public hitbox() {
    return {
      position: this.position,
      radius: this.physics.size,
    }
  };

  // get the hurtbox where living entity damaging
  public hurtbox() {
    return {
      position: this.position,
      radius: this.physics.size,
    }
  }

  // is alive or die
  public isAlive() {
    return this.health instanceof Health ? this.health.isAlive() : true;
  };

  // ticking
  public tick(delta: number) {
    if(!this.isAlive()) {
      if(!this.died) return this.kill();
    }

    if(this.relations.owner) {
      if(!this.relations.owner.isAlive()) {
        delete this.relations.owner;
        this.relations.ownerId = null;
      }
    }

    if(this.relations.root) {
      if(!this.relations.root.isAlive()) {
        delete this.relations.root;
        this.relations.rootId = null;
      } else {
        this.relations.team = this.relations.root.relations.team;
        this.relations.invisible = this.relations.root.relations.invisible;
      }
    }
    if(this.inputs instanceof Inputs) this.inputs.tick(delta);
    // if(this.ai instanceof AI) this.ai.tick();
    this.position = this.position.add(this.velocity.multiply(delta));
    this.velocity = this.velocity.multiply(1 - this.physics.friction);
  }
}