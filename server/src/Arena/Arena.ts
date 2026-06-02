import { Schema, type } from "@colyseus/schema";

export default class Arena extends Schema {
  @type("float64") public width = 500;
  @type("float64") public height = 500;
}