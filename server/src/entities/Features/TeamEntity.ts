import { Schema , type } from '@colyseus/schema';

import { nanoid } from "nanoid";
import { MatchRoom } from '../../rooms/Room.js';

/**
 * TeamEntity class that extends the Schema class from Colyseus.
 * This class represents a team in the game, identified by a unique ID.
 */

export default class TeamEntity extends Schema {
  @type("string") public readonly ID: string = nanoid();
  @type("string") public name: string = "Default Team"; // Name of the team

  @type("string") public color: string = "#FFFFFF"; // Color of the team, can be used for rendering or identification

  public teamup: TeamEntity[] = [];

  public server: MatchRoom; // Reference to the server room where this team exists

  public constructor(server: MatchRoom, name: string = "Default Team", color: string = "#FFFFFF") {
    super();
    this.server = server;
    this.name = name;
    this.color = color;

    this.server.state.teams.set(name.trim().toLowerCase(), this);
  }

  public checkTeamMember(team: TeamEntity): boolean {
    return (this.teamup.includes(team) && team.teamup.includes(this)) || this === team;
  }

  public addTeamMember(team: TeamEntity): this {
    if (!this.teamup.includes(team)) {
      this.teamup.push(team);
      team.teamup.push(this); // Ensure mutual membership
    }
    return this;
  }

  public removeTeamMember(team: TeamEntity): this {
    const index = this.teamup.indexOf(team);
    if (index !== -1) {
      this.teamup.splice(index, 1);
      const teamIndex = team.teamup.indexOf(this);
      if (teamIndex !== -1) {
        team.teamup.splice(teamIndex, 1); // Ensure mutual removal
      }
    }
    return this;
  }
}