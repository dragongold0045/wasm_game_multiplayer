import { Schema , type } from "@colyseus/schema";

export default class NameEntity extends Schema {
  @type("string") public value: string = "Unnamed";

  public constructor(name?: string) {
    super();

    this.setName(name || this.value);
  }

  public setName(value: string) {
    this.value = value;
    return this;
  }
}