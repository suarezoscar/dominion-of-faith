import { Scene } from 'excalibur';
import { Church } from '../entities/Church';
import { ChurchData, Position, TerrainType } from '../types';
import { GAME_CONFIG, TITHE_CONFIG } from '../config';
import { MapSystem } from './MapSystem';

export class ChurchSystem {
  private churches: Map<string, Church> = new Map();
  private scene: Scene;

  constructor(scene: Scene) {
    this.scene = scene;
  }

  public initialize(mapSystem: MapSystem): void {
    // Buscar todas las casillas de iglesia en el mapa
    const allTiles = mapSystem.getAllTiles();

    allTiles.forEach(tile => {
      const tileData = tile.getData();
      if (tileData.terrain === TerrainType.Church) {
        this.createChurch(tileData.position);
      }
    });

    console.log(`Inicializadas ${this.churches.size} iglesias`);
  }

  public createChurch(position: Position, playerId: string | null = null): Church {
    const churchData: ChurchData = {
      id: `church-${position.x}-${position.y}`,
      position,
      playerId,
      followers: TITHE_CONFIG.INITIAL_FOLLOWERS,
      titheRate: TITHE_CONFIG.DEFAULT_TITHE_RATE,
      connected: false,
      faithInfluenceRadius: GAME_CONFIG.FAITH_INFLUENCE_RADIUS
    };

    const church = new Church(churchData);
    this.churches.set(churchData.id, church);
    this.scene.add(church);

    return church;
  }

  public captureChurch(churchId: string, playerId: string): void {
    const church = this.churches.get(churchId);
    if (church) {
      church.setOwner(playerId);
      console.log(`Iglesia ${churchId} capturada por ${playerId}`);
    }
  }

  public collectTithes(playerId: string): number {
    let totalIncome = 0;

    this.churches.forEach(church => {
      const data = church.getData();
      if (data.playerId === playerId) {
        const income = church.calculateIncome();
        totalIncome += income;
      }
    });

    return totalIncome;
  }

  public expandFaithInfluence(mapSystem: MapSystem): void {
    this.churches.forEach(church => {
      const data = church.getData();
      if (!data.playerId) return;

      const tilesInRadius = mapSystem.getTilesInRadius(
        data.position,
        data.faithInfluenceRadius
      );

      tilesInRadius.forEach(tile => {
        const tileData = tile.getData();

        // Aumentar influencia de fe
        if (!tileData.playerId || tileData.playerId === data.playerId) {
          const newStrength = Math.min(100, tileData.faithStrength + 10);
          tile.setFaithInfluence(data.playerId, newStrength);
        } else {
          // Disputar territorio
          const newStrength = Math.max(0, tileData.faithStrength - 5);
          if (newStrength === 0) {
            tile.setFaithInfluence(null, 0);
          } else {
            tile.setFaithInfluence(tileData.playerId, newStrength);
          }
        }
      });
    });
  }

  public growAllFollowers(mapSystem: MapSystem): void {
    this.churches.forEach(church => {
      const data = church.getData();
      if (!data.playerId) return;

      // Contar territorio controlado alrededor
      const tilesInRadius = mapSystem.getTilesInRadius(
        data.position,
        data.faithInfluenceRadius
      );

      const controlledTiles = tilesInRadius.filter(tile => {
        const tileData = tile.getData();
        return tileData.playerId === data.playerId && tileData.faithStrength > 50;
      }).length;

      church.growFollowers(controlledTiles);
    });
  }

  public updateConnections(mapSystem: MapSystem, bishopricPositions: Position[]): void {
    // Implementar algoritmo de búsqueda de camino para determinar conexión
    // Por ahora, simplificado: todas conectadas
    this.churches.forEach(church => {
      church.setConnected(true);
    });
  }

  public getChurchAtPosition(position: Position): Church | undefined {
    return Array.from(this.churches.values()).find(church => {
      const pos = church.getPosition();
      return pos.x === position.x && pos.y === position.y;
    });
  }

  public getAllChurches(): Church[] {
    return Array.from(this.churches.values());
  }
}

