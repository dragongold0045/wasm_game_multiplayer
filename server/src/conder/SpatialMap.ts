import Entity from "../entities/Entity.js";
import Vector from "../native/Vector.js";

export default class SpatialMap {
  public grid: Map<string, Set<Entity>> = new Map();
  public size: number;

  constructor(size: number) {
    this.size = size;
  }

  public getKey(x: number, y: number): string {
    return `${Math.floor(x / this.size)},${Math.floor(y / this.size)}`;
  }

  public add(entity: Entity): void {
    if(!entity.isAlive()) return;
    const key = this.getKey(entity.position.x, entity.position.y);
    let cell = this.grid.get(key);
    if (!cell) {
      cell = new Set();
      this.grid.set(key, cell);
    }
    cell.add(entity);
  }

  public remove(entity: Entity): void {
    const key = this.getKey(entity.position.x, entity.position.y);
    const cell = this.grid.get(key);
    if (!cell) return;

    cell.delete(entity);
    if (cell.size === 0) {
      this.grid.delete(key);
    }
  }

  public getNearbyEntities(entity: Entity): Set<Entity> {
    if (!entity.isAlive()) return new Set();

    const { x, y } = entity.position;
    const size = Math.max(entity.physics.size, this.size);
    const startCol = Math.floor((x - size) / this.size);
    const endCol = Math.floor((x + size) / this.size);
    const startRow = Math.floor((y - size) / this.size);
    const endRow = Math.floor((y + size) / this.size);

    const nearby = new Set<Entity>();

    for (let col = startCol; col <= endCol; col++) {
      for (let row = startRow; row <= endRow; row++) {
        const cell = this.grid.get(`${col},${row}`);
        if (cell) {
          for (const e of cell) nearby.add(e);
        }
      }
    }

    return nearby;
  }

  public getEntitiesInRange(x: number, y: number, range: number): Set<Entity> {
    const result = new Set<Entity>();
    const startX = Math.floor((x - range) / this.size);
    const endX = Math.floor((x + range) / this.size);
    const startY = Math.floor((y - range) / this.size);
    const endY = Math.floor((y + range) / this.size);

    const center = new Vector(x, y);

    for (let i = startX; i <= endX; i++) {
      for (let j = startY; j <= endY; j++) {
        const cell = this.grid.get(`${i},${j}`);
        if (!cell) continue;

        for (const entity of cell) {
          if (entity.position.distanceTo(center) <= range) {
            result.add(entity);
          }
        }
      }
    }

    return result;
  }

  public clear(): void {
    this.grid.clear();
  }

  public forEach(callback: (entities: Set<Entity>, key: string) => void): void {
    this.grid.forEach(callback);
  }

  public toJSON(): any {
    const json: any = {};
    for (const [key, entities] of this.grid.entries()) {
      json[key] = Array.from(entities, entity => entity.ID);
    }
    return json;
  }

  private fetchNearbyEntity(
    entity: Entity,
    range: number,
    condition: (e: Entity) => boolean,
    reverse = false
  ): Entity | null {
    const { x, y } = entity.position;
    const visited = new Set<Entity>();
    const checkedCells = new Set<string>();
    const maxCellDist = Math.ceil(range / this.size);

    const centerCellX = Math.floor(x / this.size);
    const centerCellY = Math.floor(y / this.size);

    const distToCheck = Array.from({ length: maxCellDist + 1 }, (_, i) => i);
    if (reverse) distToCheck.reverse();

    for (const cellDist of distToCheck) {
      for (let dx = -cellDist; dx <= cellDist; dx++) {
        for (let dy = -cellDist; dy <= cellDist; dy++) {
          if (Math.abs(dx) !== cellDist && Math.abs(dy) !== cellDist) continue;

          const cellX = centerCellX + dx;
          const cellY = centerCellY + dy;
          const key = `${cellX},${cellY}`;

          if (checkedCells.has(key)) continue;
          checkedCells.add(key);

          const cell = this.grid.get(key);
          if (!cell) continue;

          for (const e of cell) {
            if (e === entity || visited.has(e)) continue;
            visited.add(e);
            if (e.position.distanceTo(entity.position) <= range && condition(e)) {
              return e;
            }
          }
        }
      }
      if ((cellDist + 1) * this.size > range) break;
    }

    return null;
  }

  public fetchFromInToOutNearbyEntity(entity: Entity, range: number, condition: (e: Entity) => boolean): Entity | null {
    return this.fetchNearbyEntity(entity, range, condition, false);
  }

  public fetchFromOutToInNearbyEntity(entity: Entity, range: number, condition: (e: Entity) => boolean): Entity | null {
    return this.fetchNearbyEntity(entity, range, condition, true);
  }
}