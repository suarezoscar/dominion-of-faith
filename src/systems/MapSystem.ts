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

  private terrainMap: Map<string, TerrainType> = new Map();

  private generateTerrain(x: number, y: number): TerrainType {
    const key = this.getKey(x, y);

    // Si ya fue generado (parte de una zona), retornar
    if (this.terrainMap.has(key)) {
      return this.terrainMap.get(key)!;
    }

    // === CASTILLOS EN LAS 4 ESQUINAS (para 4 jugadores) ===
    // Jugador 1: Esquina superior izquierda
    if ((x === 2 && y === 2) || (x === 3 && y === 2) || (x === 2 && y === 3) || (x === 3 && y === 3)) {
      this.terrainMap.set(key, TerrainType.Castle);
      return TerrainType.Castle;
    }
    // Jugador 2: Esquina superior derecha
    if ((x === GAME_CONFIG.MAP_WIDTH - 3 && y === 2) || (x === GAME_CONFIG.MAP_WIDTH - 4 && y === 2) ||
        (x === GAME_CONFIG.MAP_WIDTH - 3 && y === 3) || (x === GAME_CONFIG.MAP_WIDTH - 4 && y === 3)) {
      this.terrainMap.set(key, TerrainType.Castle);
      return TerrainType.Castle;
    }
    // Jugador 3: Esquina inferior izquierda
    if ((x === 2 && y === GAME_CONFIG.MAP_HEIGHT - 3) || (x === 3 && y === GAME_CONFIG.MAP_HEIGHT - 3) ||
        (x === 2 && y === GAME_CONFIG.MAP_HEIGHT - 4) || (x === 3 && y === GAME_CONFIG.MAP_HEIGHT - 4)) {
      this.terrainMap.set(key, TerrainType.Castle);
      return TerrainType.Castle;
    }
    // Jugador 4: Esquina inferior derecha
    if ((x === GAME_CONFIG.MAP_WIDTH - 3 && y === GAME_CONFIG.MAP_HEIGHT - 3) ||
        (x === GAME_CONFIG.MAP_WIDTH - 4 && y === GAME_CONFIG.MAP_HEIGHT - 3) ||
        (x === GAME_CONFIG.MAP_WIDTH - 3 && y === GAME_CONFIG.MAP_HEIGHT - 4) ||
        (x === GAME_CONFIG.MAP_WIDTH - 4 && y === GAME_CONFIG.MAP_HEIGHT - 4)) {
      this.terrainMap.set(key, TerrainType.Castle);
      return TerrainType.Castle;
    }

    // === CORDILLERAS HORIZONTALES (4x1) ===
    // Cordillera superior
    if (y === 5 && x >= 4 && x <= 7) {
      this.terrainMap.set(key, TerrainType.Mountain);
      return TerrainType.Mountain;
    }
    if (y === 5 && x >= 12 && x <= 15) {
      this.terrainMap.set(key, TerrainType.Mountain);
      return TerrainType.Mountain;
    }
    // Cordillera central
    if (y === 10 && x >= 2 && x <= 5) {
      this.terrainMap.set(key, TerrainType.Mountain);
      return TerrainType.Mountain;
    }
    if (y === 10 && x >= 14 && x <= 17) {
      this.terrainMap.set(key, TerrainType.Mountain);
      return TerrainType.Mountain;
    }
    // Cordillera inferior
    if (y === 14 && x >= 4 && x <= 7) {
      this.terrainMap.set(key, TerrainType.Mountain);
      return TerrainType.Mountain;
    }
    if (y === 14 && x >= 12 && x <= 15) {
      this.terrainMap.set(key, TerrainType.Mountain);
      return TerrainType.Mountain;
    }

    // === CORDILLERAS VERTICALES (1x4) ===
    if (x === 5 && y >= 12 && y <= 15) {
      this.terrainMap.set(key, TerrainType.Mountain);
      return TerrainType.Mountain;
    }
    if (x === 14 && y >= 4 && y <= 7) {
      this.terrainMap.set(key, TerrainType.Mountain);
      return TerrainType.Mountain;
    }

    // === IGLESIAS (una por cuadrante) ===
    if ((x === 5 && y === 8) || (x === 14 && y === 8) ||
        (x === 8 && y === 5) || (x === 8 && y === 14)) {
      this.terrainMap.set(key, TerrainType.Church);
      return TerrainType.Church;
    }

    // === BOSQUES (2x2) - Distribuidos estratégicamente ===
    const forestZones = [
      {x: 7, y: 7}, {x: 12, y: 7}, {x: 7, y: 12}, {x: 12, y: 12},
      {x: 4, y: 10}, {x: 15, y: 10}, {x: 10, y: 4}, {x: 10, y: 15}
    ];

    for (const zone of forestZones) {
      if (x >= zone.x && x < zone.x + 2 && y >= zone.y && y < zone.y + 2) {
        this.terrainMap.set(key, TerrainType.Forest);
        return TerrainType.Forest;
      }
    }


    // === LLANURA (por defecto - la mayoría del mapa) ===
    this.terrainMap.set(key, TerrainType.Plain);
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

