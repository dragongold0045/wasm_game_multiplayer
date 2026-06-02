import * as colyseus from "@colyseus/sdk";
import statement from "./statement";
import { RoomState } from "../outside_type";

let server: colyseus.Client | null = null;
let room: colyseus.Room<RoomState> | null = null;
let currentServerUrl: string | null = null;

export function establishServer(url: string = "ws://localhost:2567") {
  // check if old server exist
  if(!!server && !!currentServerUrl) {
    console.log("left old server", currentServerUrl);
  }
  // establish new server
  server = new colyseus.Client(url);
  currentServerUrl = url;
  console.log("established new server", url);
}

export async function joinRoom(roomName: string = "my_room", options?: any) {
  if(!server) {
    throw new Error("No server established");
  }
  // remove all listeners of old room
  if(!!room) room.removeAllListeners();

  // joining new room
  room = await server.joinOrCreate(roomName, options);
  statement(room);
  console.log("joined room", roomName);
}

export {
  server as Client,
  room as MatchRoom,
  currentServerUrl as ServerUrl,
}