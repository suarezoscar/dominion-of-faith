import {Actor, Color, vec, Rectangle} from 'excalibur';
import {ChurchData, Position} from '../types';
import {GAME_CONFIG, TITHE_CONFIG} from '../config';

export class Church extends Actor {
    private churchData: ChurchData;

    constructor(churchData: ChurchData) {
        super({
            pos: vec(
                churchData.position.x * GAME_CONFIG.TILE_SIZE + GAME_CONFIG.TILE_SIZE / 2,
                churchData.position.y * GAME_CONFIG.TILE_SIZE + GAME_CONFIG.TILE_SIZE / 2
            ),
            width: GAME_CONFIG.TILE_SIZE * 0.8,
            height: GAME_CONFIG.TILE_SIZE * 0.8,
            z: 5
        });

        this.churchData = churchData;
        this.setupGraphics();
    }

    private setupGraphics(): void {
        const color = this.churchData.playerId
            ? Color.fromHex('#FFD700')
            : Color.fromHex('#808080');

        const rect = new Rectangle({
            width: GAME_CONFIG.TILE_SIZE * 0.6,
            height: GAME_CONFIG.TILE_SIZE * 0.6,
            color
        });

        this.graphics.use(rect);
    }

    public getData(): ChurchData {
        return this.churchData;
    }

    public setOwner(playerId: string | null): void {
        this.churchData.playerId = playerId;
        this.setupGraphics();
    }

    public calculateIncome(): number {
        if (!this.churchData.connected || !this.churchData.playerId) {
            return 0;
        }

        // Fórmula del GDD: Ingreso = F * D * C
        return Math.floor(
            this.churchData.followers *
            this.churchData.titheRate *
            (this.churchData.connected ? 1 : 0)
        );
    }

    public growFollowers(territoryBonus: number): void {
        // Fórmula del GDD: ΔF = T * k * (1 - D_penalización)
        const tithePenalty = this.churchData.titheRate / TITHE_CONFIG.MAX_TITHE_RATE;
        const growth = Math.floor(
            territoryBonus *
            TITHE_CONFIG.FOLLOWER_GROWTH_CONSTANT *
            (1 - tithePenalty)
        );

        this.churchData.followers += growth;
    }

    public setTitheRate(rate: number): void {
        this.churchData.titheRate = Math.max(
            TITHE_CONFIG.MIN_TITHE_RATE,
            Math.min(TITHE_CONFIG.MAX_TITHE_RATE, rate)
        );
    }

    public setConnected(connected: boolean): void {
        this.churchData.connected = connected;
    }

    public getPosition(): Position {
        return this.churchData.position;
    }
}

