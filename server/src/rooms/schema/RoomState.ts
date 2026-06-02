import { MapSchema, Schema, type } from "@colyseus/schema";
import Arena from "../../Arena/Arena.js";
import TeamEntity from "../../entities/Features/TeamEntity.js";
import Entity from "../../entities/Entity.js";
import { PlayerController, PlayerControllerManager } from "./PlayerController.js";
import SpatialMap from "../../conder/SpatialMap.js";

class EntitiesManager extends MapSchema<Entity> {
  public set(key: string, value: Entity): this {
    value.onAdd();
    return super.set(key, value);
  }

  public delete(key: string): boolean {
    const value = this.get(key);
    if(value) value.onDelete();
    return super.delete(key);
  }
}

export class RoomState extends Schema {

  @type({ map: TeamEntity }) public teams = new MapSchema();
  @type({ map: Entity }) public entities = new EntitiesManager;
  @type({ map: PlayerController }) public players = new PlayerControllerManager;
  @type(Arena) public arena = new Arena();

  public spatial = new SpatialMap(150);
  
}
