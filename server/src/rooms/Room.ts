import { Room, Client, CloseCode } from "colyseus";
import { RoomState } from "./schema/RoomState.js";
import { PlayerController } from "./schema/PlayerController.js";
import Entity from "../entities/Entity.js";
import Vector from "../native/Vector.js";
import { ENTITIES, INPUTS } from "../conder/enum.js";

export class MatchRoom extends Room {
  maxClients = 4000;
  state = new RoomState();

  messages = {
    yourMessageType: (client: Client, message: any) => {
      /**
       * Handle "yourMessageType" message.
       */
      console.log(client.sessionId, "sent a message:", message);
    }
  }

  onCreate (options: any) {
    /**
     * Called when a new room is created.
     */
    this.onMessage("inputs", (client, inputs: INPUTS) => {
      const player = this.state.players.get(client.sessionId);
      if(!player) return;
      player.onInputs(inputs);
      // console.log(inputs);
    });
    this.startTick();
  }

  onJoin (client: Client, options: any) {
    /**
     * Called when a client joins the room.
     */
    client.send("load arena");
    const player = new PlayerController(this, client);
    this.state.players.set(client.sessionId, player);

    const entity = new Entity(this);
    entity.spawn();

    if(Math.random() < .5) entity.TYPE = ENTITIES.AUTO_TURRET;

    player.setControl(entity);

    console.log(client.sessionId, "joined!");
  }

  onLeave (client: Client, code: CloseCode) {
    /**
     * Called when a client leaves the room.
     */

    this.state.players.delete(client.sessionId);
    console.log(client.sessionId, "left!", code);
  }

  onDispose() {
    /**
     * Called when the room is disposed.
     */
    console.log("room", this.roomId, "disposing...");
  }

  public updateTick(delta: number) {
    const spatial = this.state.spatial;
    const area = this.state.arena;
    
    this.state.entities.forEach(entity => {
      if (entity.died) return;

      spatial.add(entity);
      entity.tick(delta);

      if (area && entity.collide.collisionWithMap) {
        const size = entity.collide.collisionMapWithSize ? entity.physics.size : 0;

        if(entity.position.x - size < -area.width / 2) {
          entity.position.x = -area.width / 2 + size;
          entity.velocity.x = 0;
        }

        if(entity.position.x + size > area.width / 2) {
          entity.position.x = area.width / 2 - size;
          entity.velocity.x = 0;
        }

        if(entity.position.y - size < -area.height / 2) {
          entity.position.y = -area.height / 2 + size;
          entity.velocity.y = 0;
        }

        if(entity.position.y + size > area.height / 2) {
          entity.position.y = area.height / 2 - size;
          entity.velocity.y = 0;
        }
      }
    });
    
    spatial.clear();
    this.broadcast("tick");
  }

  public startTick() {
    this.setSimulationInterval((_delta) => {
      const delta = _delta / 1000;
      if (!this.clients.length) return;
      this.updateTick(delta);
    }, 1000 / 30);
  }
}
