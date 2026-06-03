import { Room , getStateCallbacks } from "@colyseus/sdk";
import { Module } from "./wasm";
import { readText } from "./wasmsupporter";
import { RoomState } from "../outside_type";
import inputs from "./inputs";

export default function(room: Room<RoomState>) {
  // if wasm doesn't exist
  if(!Module) return console.warn("statement Module not initialized");

  // check old IDs
  console.log("Room ID (preload):", readText(Module._getRoomId(), Module.HEAPU8));
  console.log("Session ID (preload):", readText(Module._getSessionId(), Module.HEAPU8));

  // convert to utf8
  let roomId = Module.allocateUTF8(room.roomId);
  let sessionId = Module.allocateUTF8(room.sessionId);

  // push IDs into wasm c++
  Module._setRoomId(roomId);
  Module._setSessionId(sessionId);

  // relesse memory
  Module._free(roomId);
  Module._free(sessionId);

  // state - reponding - eventing

  room.onMessage("*", (message) => {
    if(typeof message === "string" && message.trim().toLowerCase() === "tick") return;
    console.log("received message", message);
  });

  room.onMessage("tick", () => {
    room.send("inputs", inputs);
  });

  const $ = getStateCallbacks(room);

  $(room.state).entities.onAdd((item, id) => {
    Module.addNewEntity({
      ID: id,
      TYPE: item.TYPE,
      size: item.physics.size,
      angle: item.physics.angle,
      position: item.position.toJSON(),
    })
  });

  $(room.state).entities.onRemove((item, id) => {
    Module.removeEntity(id);
  });

  room.onMessage("load arena", () => {
    console.log("Modified arena / loaded arena (after joining)");

    console.log("ArenaOption (previous update):", Module.currentArenaOptions());
    Module._setArenaSize(room.state.arena.width, room.state.arena.height);
    console.log("ArenaOption (new):", Module.currentArenaOptions());
  });

  room.onMessage("control", (ID: string) => {
    console.log("New controller ID", ID);
    Module.setControl(ID);
  });

  room.onError((code, message) => Module.handleError(code, message));

  // check new IDs (after preload)
  console.log("Room ID:", readText(Module._getRoomId(), Module.HEAPU8));
  console.log("Session ID:", readText(Module._getSessionId(), Module.HEAPU8));
}