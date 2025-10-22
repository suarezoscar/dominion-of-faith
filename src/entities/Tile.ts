import {Actor, Color, vec, Rectangle, Sprite, GraphicsGroup, Canvas} from 'excalibur';
import {TerrainType, TileData, Position} from '../types';
import {GAME_CONFIG} from '../config';
import {Resources} from '../resources';

export class Tile extends Actor {
    private tileData: TileData;
    private highlight: boolean = false;
    private pulseTime: number = 0;
    private isPulsing: boolean = false;

    constructor(position: Position, terrain: TerrainType) {
        super({
            pos: vec(
                position.x * GAME_CONFIG.TILE_SIZE + GAME_CONFIG.TILE_SIZE / 2,
                position.y * GAME_CONFIG.TILE_SIZE + GAME_CONFIG.TILE_SIZE / 2
            ),
            width: GAME_CONFIG.TILE_SIZE,
            height: GAME_CONFIG.TILE_SIZE,
            anchor: vec(0.5, 0.5)
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
            // Escalar el sprite para que llene el tile dejando margen del borde
            sprite.width = GAME_CONFIG.TILE_SIZE - 4;
            sprite.height = GAME_CONFIG.TILE_SIZE - 4;
            // En Excalibur, usar directamente use() con el sprite
            this.graphics.use(sprite);
        } else {
            // Fallback a color si no hay sprite
            const color = this.getTerrainColor();
            const fill = new Rectangle({
                width: GAME_CONFIG.TILE_SIZE - 4,
                height: GAME_CONFIG.TILE_SIZE - 4,
                color
            });
            this.graphics.use(fill);
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
            case TerrainType.Mountain:
                return Color.fromHex('#808080');
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
            // Escalar el sprite
            sprite.width = GAME_CONFIG.TILE_SIZE - 4;
            sprite.height = GAME_CONFIG.TILE_SIZE - 4;

            // Si está resaltado con parpadeo, crear canvas con efectos
            if (this.highlight && this.isPulsing) {
                const pulseSpeed = 0.005;
                const pulseValue = Math.sin(this.pulseTime * pulseSpeed) * 0.5 + 0.5;

                const canvas = new Canvas({
                    width: GAME_CONFIG.TILE_SIZE,
                    height: GAME_CONFIG.TILE_SIZE,
                    draw: (ctx) => {
                        const centerX = GAME_CONFIG.TILE_SIZE / 2;
                        const centerY = GAME_CONFIG.TILE_SIZE / 2;
                        const size = GAME_CONFIG.TILE_SIZE - 4;

                        // Dibujar sprite de terreno
                        const img = sprite.image?.image;
                        if (img) {
                            ctx.drawImage(img, 2, 2, size, size);
                        }

                        // Overlay amarillo parpadeante
                        const overlayAlpha = 0.3 + (pulseValue * 0.5);
                        ctx.fillStyle = `rgba(255, 255, 0, ${overlayAlpha})`;
                        ctx.fillRect(2, 2, size, size);

                        // Borde grueso parpadeante
                        const borderThickness = 3 + Math.floor(pulseValue * 3);
                        ctx.strokeStyle = 'rgba(255, 255, 0, 1)';
                        ctx.lineWidth = borderThickness;
                        ctx.strokeRect(2, 2, size, size);
                    }
                });

                this.graphics.use(canvas);
            } else if (this.highlight) {
                // Resaltado estático sin parpadeo
                const canvas = new Canvas({
                    width: GAME_CONFIG.TILE_SIZE,
                    height: GAME_CONFIG.TILE_SIZE,
                    draw: (ctx) => {
                        const size = GAME_CONFIG.TILE_SIZE - 4;

                        // Dibujar sprite de terreno
                        const img = sprite.image?.image;
                        if (img) {
                            ctx.drawImage(img, 2, 2, size, size);
                        }

                        // Overlay amarillo estático
                        ctx.fillStyle = 'rgba(255, 255, 0, 0.4)';
                        ctx.fillRect(2, 2, size, size);
                    }
                });

                this.graphics.use(canvas);
            } else {
                // Sin resaltado, solo el sprite
                sprite.tint = Color.White;
                this.graphics.use(sprite);
            }
        } else {
            // Fallback a color si no hay sprite
            let color = this.getTerrainColor();
            if (this.highlight) {
                if (this.isPulsing) {
                    const pulseSpeed = 0.005;
                    const pulseValue = Math.sin(this.pulseTime * pulseSpeed) * 0.5 + 0.5;
                    const lightenAmount = 0.2 + (pulseValue * 0.5);
                    color = color.lighten(lightenAmount);
                } else {
                    color = color.lighten(0.3);
                }
            }
            const fill = new Rectangle({
                width: GAME_CONFIG.TILE_SIZE - 4,
                height: GAME_CONFIG.TILE_SIZE - 4,
                color
            });
            this.graphics.use(fill);
        }
    }

    public getData(): TileData {
        return this.tileData;
    }

    public setHighlight(highlight: boolean, enablePulse: boolean = false): void {
        this.highlight = highlight;
        this.isPulsing = enablePulse;
        if (!highlight) {
            this.isPulsing = false;
            this.pulseTime = 0;
        }
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

    public setPulsing(pulsing: boolean): void {
        this.isPulsing = pulsing;
        if (!pulsing) {
            this.pulseTime = 0;
        }
    }

    override onPreUpdate(engine: any, elapsedMs: number): void {
        super.onPreUpdate(engine, elapsedMs);

        // Animar el parpadeo solo si está resaltado y pulsando
        if (this.highlight && this.isPulsing) {
            this.pulseTime += elapsedMs;
            this.updateVisuals();
        }
    }
}

