import { Scene } from 'excalibur';
import { Tile } from '../entities/Tile';
import { TerrainType, Position } from '../types';
import { GAME_CONFIG } from '../config';

export class MapSystem {
  private tiles: Map<string, Tile> = new Map();
  private scene: Scene;

  constructor(scene: Scene) {
    this.scene = scene;
  }

  public initialize(): void {
    this.generateMap();
  }

  private generateMap(): void {
    for (let y = 0; y < GAME_CONFIG.MAP_HEIGHT; y++) {
      for (let x = 0; x < GAME_CONFIG.MAP_WIDTH; x++) {
        const terrain = this.generateTerrain(x, y);
        const tile = new Tile({ x, y }, terrain);
        const key = this.getKey(x, y);
        this.tiles.set(key, tile);
        this.scene.add(tile);
      }
    }
  }

  private generateTerrain(x: number, y: number): TerrainType {
    // Generación procedural ajustada para mapa 12x10 (móvil)
    // Castillos en las esquinas
    if ((x === 1 && y === 1) || (x === GAME_CONFIG.MAP_WIDTH - 2 && y === GAME_CONFIG.MAP_HEIGHT - 2)) {
      return TerrainType.Castle;
    }

    // Iglesias estratégicamente distribuidas (menos que antes por mapa más pequeño)
    if ((x === 6 && y === 5) || (x === 3 && y === 7) || (x === 9 && y === 3)) {
      return TerrainType.Church;
    }

    // Montañas en los bordes
    if (x === 0 || y === 0 || x === GAME_CONFIG.MAP_WIDTH - 1 || y === GAME_CONFIG.MAP_HEIGHT - 1) {
      return TerrainType.Mountain;
    }

    // Distribución aleatoria de otros terrenos
    const rand = Math.random();
    if (rand < 0.5) return TerrainType.Plain;
    if (rand < 0.7) return TerrainType.Forest;
    if (rand < 0.8) return TerrainType.Hill;
    if (rand < 0.85) return TerrainType.Village;
    return TerrainType.Plain;
  }

  private getKey(x: number, y: number): string {
    return `${x},${y}`;
  }

  public getTile(position: Position): Tile | undefined {
    return this.tiles.get(this.getKey(position.x, position.y));
  }

  public getTileAt(x: number, y: number): Tile | undefined {
    return this.tiles.get(this.getKey(x, y));
  }

  public getNeighbors(position: Position): Tile[] {
    const neighbors: Tile[] = [];
    const directions = [
      { x: -1, y: 0 }, { x: 1, y: 0 },
      { x: 0, y: -1 }, { x: 0, y: 1 },
      { x: -1, y: -1 }, { x: 1, y: -1 },
      { x: -1, y: 1 }, { x: 1, y: 1 }
    ];

    for (const dir of directions) {
      const newX = position.x + dir.x;
      const newY = position.y + dir.y;
      const tile = this.getTileAt(newX, newY);
      if (tile) {
        neighbors.push(tile);
      }
    }

    return neighbors;
  }

  public getTilesInRadius(center: Position, radius: number): Tile[] {
    const tiles: Tile[] = [];

    for (let y = center.y - radius; y <= center.y + radius; y++) {
      for (let x = center.x - radius; x <= center.x + radius; x++) {
        const distance = Math.sqrt(
          Math.pow(x - center.x, 2) + Math.pow(y - center.y, 2)
        );

        if (distance <= radius) {
          const tile = this.getTileAt(x, y);
          if (tile) {
            tiles.push(tile);
          }
        }
      }
    }

    return tiles;
  }

  public highlightTiles(tiles: Tile[], highlight: boolean): void {
    tiles.forEach(tile => tile.setHighlight(highlight));
  }

  public getAllTiles(): Tile[] {
    return Array.from(this.tiles.values());
  }
}

