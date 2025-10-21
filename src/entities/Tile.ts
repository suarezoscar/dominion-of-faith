import { Actor, Color, vec, Rectangle } from 'excalibur';
import { TerrainType, TileData, Position } from '../types';
import { GAME_CONFIG } from '../config';

export class Tile extends Actor {
  private tileData: TileData;
  private highlight: boolean = false;

  constructor(position: Position, terrain: TerrainType) {
    super({
      pos: vec(
        position.x * GAME_CONFIG.TILE_SIZE,
        position.y * GAME_CONFIG.TILE_SIZE
      ),
      width: GAME_CONFIG.TILE_SIZE,
      height: GAME_CONFIG.TILE_SIZE
    });

    this.tileData = {
      position,
      terrain,
      playerId: null,
      faithStrength: 0,
      units: []
    };

    this.setupGraphics();
  }

  private setupGraphics(): void {
    const color = this.getTerrainColor();
    this.graphics.use(new Rectangle({
      width: GAME_CONFIG.TILE_SIZE - 2,
      height: GAME_CONFIG.TILE_SIZE - 2,
      color
    }));
  }

  private getTerrainColor(): Color {
    switch (this.tileData.terrain) {
      case TerrainType.Plain:
        return Color.fromHex('#90EE90');
      case TerrainType.Forest:
        return Color.fromHex('#228B22');
      case TerrainType.Hill:
        return Color.fromHex('#D2B48C');
      case TerrainType.Mountain:
        return Color.fromHex('#808080');
      case TerrainType.River:
        return Color.fromHex('#4682B4');
      case TerrainType.Swamp:
        return Color.fromHex('#556B2F');
      case TerrainType.Road:
        return Color.fromHex('#8B4513');
      case TerrainType.Village:
        return Color.fromHex('#FFE4B5');
      case TerrainType.Church:
        return Color.fromHex('#FFD700');
      case TerrainType.Castle:
        return Color.fromHex('#696969');
      default:
        return Color.Gray;
    }
  }

  public getData(): TileData {
    return this.tileData;
  }

  public setHighlight(highlight: boolean): void {
    this.highlight = highlight;
    this.updateVisuals();
  }

  public setFaithInfluence(playerId: string | null, strength: number): void {
    this.tileData.playerId = playerId;
    this.tileData.faithStrength = strength;
    this.updateVisuals();
  }

  private updateVisuals(): void {
    let color = this.getTerrainColor();

    if (this.highlight) {
      color = color.lighten(0.3);
    }

    if (this.tileData.playerId && this.tileData.faithStrength > 0) {
      // Aquí podrías agregar un overlay de color del jugador
      // basado en la fuerza de fe
    }

    this.graphics.use(new Rectangle({
      width: GAME_CONFIG.TILE_SIZE - 2,
      height: GAME_CONFIG.TILE_SIZE - 2,
      color
    }));
  }

  public getGridPosition(): Position {
    return this.tileData.position;
  }
}

