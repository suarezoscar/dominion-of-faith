import {Actor, Color, vec, Rectangle, Sprite} from 'excalibur';
import {TerrainType, TileData, Position} from '../types';
import {GAME_CONFIG} from '../config';
import {Resources} from '../resources';

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
        const sprite = this.getTerrainSprite();
        if (sprite) {
            this.graphics.use(sprite);
        } else {
            // Fallback a color si no hay sprite
            const color = this.getTerrainColor();
            this.graphics.use(new Rectangle({
                width: GAME_CONFIG.TILE_SIZE - 2,
                height: GAME_CONFIG.TILE_SIZE - 2,
                color
            }));
        }
    }

    private getTerrainSprite(): Sprite | null {
        const x = this.tileData.position.x;
        const y = this.tileData.position.y;

        switch (this.tileData.terrain) {
            case TerrainType.Plain:
                return ((x + y) % 2 === 0)
                    ? Resources.Plain1.toSprite()
                    : Resources.Plain2.toSprite();

            case TerrainType.Forest:
                const forestVariant = (x * 3 + y * 7) % 4;
                switch (forestVariant) {
                    case 0:
                        return Resources.Forest1.toSprite();
                    case 1:
                        return Resources.Forest2.toSprite();
                    case 2:
                        return Resources.Forest3.toSprite();
                    case 3:
                        return Resources.Forest4.toSprite();
                }
                return Resources.Forest1.toSprite();

            case TerrainType.Mountain:
                return ((x + y) % 2 === 0)
                    ? Resources.Mountain1.toSprite()
                    : Resources.Mountain2.toSprite();

            case TerrainType.Castle:
                return ((x + y) % 2 === 0)
                    ? Resources.Castle1.toSprite()
                    : Resources.Castle2.toSprite();

            case TerrainType.Church:
                return Resources.Church1.toSprite();

            default:
                return null;
        }
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

    private updateVisuals(): void {
        const sprite = this.getTerrainSprite();

        if (sprite) {
            if (this.highlight) {
                sprite.tint = Color.White.lighten(0.3);
            } else if (this.tileData.playerId && this.tileData.faithStrength > 0) {
                const faithAlpha = this.tileData.faithStrength / 100;
                sprite.tint = Color.fromRGB(255, 215, 0, faithAlpha * 0.3);
            } else {
                sprite.tint = Color.White;
            }
            this.graphics.use(sprite);
        } else {
            let color = this.getTerrainColor();
            if (this.highlight) {
                color = color.lighten(0.3);
            }
            this.graphics.use(new Rectangle({
                width: GAME_CONFIG.TILE_SIZE - 2,
                height: GAME_CONFIG.TILE_SIZE - 2,
                color
            }));
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

    public getGridPosition(): Position {
        return this.tileData.position;
    }
}

