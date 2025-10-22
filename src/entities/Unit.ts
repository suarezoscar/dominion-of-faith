import { Actor, Color, vec, Circle, Sprite, GraphicsGroup, Canvas } from 'excalibur';
import { UnitData, UnitType, UnitLevel, Position } from '../types';
import { GAME_CONFIG } from '../config';
import { Resources } from '../resources';

export class Unit extends Actor {
  private unitData: UnitData;
  private selected: boolean = false;
  private pulseTime: number = 0;

  constructor(unitData: UnitData) {
    super({
      pos: vec(
        unitData.position.x * GAME_CONFIG.TILE_SIZE + GAME_CONFIG.TILE_SIZE / 2,
        unitData.position.y * GAME_CONFIG.TILE_SIZE + GAME_CONFIG.TILE_SIZE / 2
      ),
      width: GAME_CONFIG.TILE_SIZE,
      height: GAME_CONFIG.TILE_SIZE,
      z: 10
    });

    this.unitData = unitData;
    this.setupGraphics();
  }

  private setupGraphics(): void {
    const sprite = this.getUnitSprite();
    if (sprite) {
      this.graphics.use(sprite);
    } else {
      // Fallback a círculo de color
      const color = this.getUnitColor();
      const size = this.getUnitSize();
      const circle = new Circle({
        radius: size,
        color
      });
      this.graphics.use(circle);
    }
  }

  private getUnitSprite(): Sprite | null {
    if (this.unitData.type === UnitType.Bishop) {
      return Resources.Bishop1.toSprite();
    } else if (this.unitData.type === UnitType.Knight) {
      // Usar diferentes sprites según el nivel
      switch (this.unitData.level) {
        case UnitLevel.Basic:
          return Resources.Knight1.toSprite();
        case UnitLevel.Veteran:
          return Resources.Knight2.toSprite();
        case UnitLevel.Elite:
          return Resources.Knight3.toSprite();
        default:
          return Resources.Knight1.toSprite();
      }
    }
    return null;
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
    if (!selected) {
      this.pulseTime = 0;
    }
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
    const sprite = this.getUnitSprite();

    if (sprite) {
      // Si está seleccionada, crear un canvas con efectos dibujados
      if (this.selected) {
        const pulseSpeed = 0.006;
        const pulseValue = Math.sin(this.pulseTime * pulseSpeed) * 0.5 + 0.5;

        // Crear un canvas personalizado
        const size = GAME_CONFIG.TILE_SIZE + 10;
        const canvas = new Canvas({
          width: size,
          height: size,
          draw: (ctx) => {
            const centerX = size / 2;
            const centerY = size / 2;

            // Dibujar halo de fondo
            const haloRadius = (GAME_CONFIG.TILE_SIZE / 2) + 2 + (pulseValue * 4);
            const haloAlpha = 0.5 + (pulseValue * 0.4);
            ctx.fillStyle = `rgba(255, 255, 0, ${haloAlpha})`;
            ctx.beginPath();
            ctx.arc(centerX, centerY, haloRadius, 0, Math.PI * 2);
            ctx.fill();

            // Dibujar el sprite en el centro
            if (this.unitData.hasMoved) {
              ctx.globalAlpha = 0.5;
            }
            const spriteSize = GAME_CONFIG.TILE_SIZE;
            const spriteX = centerX - spriteSize / 2;
            const spriteY = centerY - spriteSize / 2;

            // Dibujar sprite (necesitamos acceder a la imagen)
            const img = sprite.image?.image;
            if (img) {
              ctx.drawImage(img, spriteX, spriteY, spriteSize, spriteSize);
            }
            ctx.globalAlpha = 1;

            // Dibujar borde circular
            const borderThickness = 3 + Math.floor(pulseValue * 3);
            ctx.strokeStyle = 'rgba(255, 255, 0, 1)';
            ctx.lineWidth = borderThickness;
            ctx.beginPath();
            ctx.arc(centerX, centerY, GAME_CONFIG.TILE_SIZE / 2, 0, Math.PI * 2);
            ctx.stroke();
          }
        });

        this.graphics.use(canvas);
      } else {
        // No seleccionada, usar sprite normal
        if (this.unitData.hasMoved) {
          sprite.tint = Color.Gray;
        } else {
          sprite.tint = Color.White;
        }
        this.graphics.use(sprite);
      }
    } else {
      // Fallback a círculo
      let color = this.getUnitColor();
      if (this.selected) {
        const pulseSpeed = 0.006;
        const pulseValue = Math.sin(this.pulseTime * pulseSpeed) * 0.5 + 0.5;
        const lightenAmount = 0.3 + (pulseValue * 0.5);
        color = color.lighten(lightenAmount);
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

  override onPreUpdate(engine: any, elapsedMs: number): void {
    super.onPreUpdate(engine, elapsedMs);

    // Animar el parpadeo de la unidad seleccionada
    if (this.selected) {
      this.pulseTime += elapsedMs;
      this.updateVisuals();
    }
  }
}

