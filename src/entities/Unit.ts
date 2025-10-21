import { Actor, Color, vec, Circle, Text, Font, TextAlign } from 'excalibur';
import { UnitData, UnitType, UnitLevel, Position } from '../types';
import { GAME_CONFIG } from '../config';

export class Unit extends Actor {
  private unitData: UnitData;
  private selected: boolean = false;

  constructor(unitData: UnitData) {
    super({
      pos: vec(
        unitData.position.x * GAME_CONFIG.TILE_SIZE + GAME_CONFIG.TILE_SIZE / 2,
        unitData.position.y * GAME_CONFIG.TILE_SIZE + GAME_CONFIG.TILE_SIZE / 2
      ),
      width: GAME_CONFIG.TILE_SIZE * 0.6,
      height: GAME_CONFIG.TILE_SIZE * 0.6,
      z: 10
    });

    this.unitData = unitData;
    this.setupGraphics();
  }

  private setupGraphics(): void {
    const color = this.getUnitColor();
    const size = this.getUnitSize();

    // Círculo para representar la unidad
    const circle = new Circle({
      radius: size,
      color
    });

    this.graphics.use(circle);
  }

  private getUnitColor(): Color {
    // El color debería venir del jugador, por ahora usamos colores por tipo
    if (this.unitData.type === UnitType.Bishop) {
      return Color.fromHex('#9370DB');
    }
    return Color.fromHex('#FF6347');
  }

  private getUnitSize(): number {
    const baseSize = GAME_CONFIG.TILE_SIZE * 0.25;
    return baseSize + (this.unitData.level - 1) * 3;
  }

  public getData(): UnitData {
    return this.unitData;
  }

  public setSelected(selected: boolean): void {
    this.selected = selected;
    this.updateVisuals();
  }

  public moveTo(position: Position): void {
    this.unitData.position = position;
    this.pos = vec(
      position.x * GAME_CONFIG.TILE_SIZE + GAME_CONFIG.TILE_SIZE / 2,
      position.y * GAME_CONFIG.TILE_SIZE + GAME_CONFIG.TILE_SIZE / 2
    );
  }

  public setHasMoved(hasMoved: boolean): void {
    this.unitData.hasMoved = hasMoved;
    this.updateVisuals();
  }

  public resetForNewTurn(): void {
    this.unitData.hasMoved = false;
    this.unitData.hasAttacked = false;
    this.unitData.movement = this.unitData.maxMovement;
    this.updateVisuals();
  }

  private updateVisuals(): void {
    let color = this.getUnitColor();

    if (this.selected) {
      color = color.lighten(0.3);
    } else if (this.unitData.hasMoved) {
      color = color.darken(0.3);
    }

    const size = this.getUnitSize();
    const circle = new Circle({
      radius: size,
      color
    });

    this.graphics.use(circle);
  }

  public canMerge(otherUnit: Unit): boolean {
    const otherData = otherUnit.getData();
    return (
      this.unitData.type === otherData.type &&
      this.unitData.level === otherData.level &&
      this.unitData.level < UnitLevel.Elite &&
      this.unitData.playerId === otherData.playerId &&
      this.unitData.position.x === otherData.position.x &&
      this.unitData.position.y === otherData.position.y
    );
  }

  public merge(otherUnit: Unit): UnitData {
    const newLevel = (this.unitData.level + 1) as UnitLevel;
    return {
      ...this.unitData,
      id: `unit-${Date.now()}`,
      level: newLevel,
      maxHealth: this.unitData.maxHealth * 1.5,
      health: this.unitData.maxHealth * 1.5
    };
  }
}

