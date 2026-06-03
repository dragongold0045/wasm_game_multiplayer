import { Schema, type } from "@colyseus/schema";

export default class Arena extends Schema {
  @type("float64") public width = 2500;
  @type("float64") public height = 2500;
}