import { Scene, Engine, Keys } from 'excalibur';
import { GameManager } from './systems/GameManager';
import { UnitType, UnitLevel } from './types';
import { GAME_CONFIG } from './config';

export class GameLevel extends Scene {
  private gameManager!: GameManager;
  private selectedUnit: any = null;
  private validMovementTiles: any[] = [];

  override onInitialize(engine: Engine): void {
    console.log('🎮 Inicializando Dominion of Faith (Móvil)...');

    this.gameManager = new GameManager(this);
    this.gameManager.initialize();

    // Crear unidades de prueba (4 jugadores en mapa 20x20)
    const unitSystem = this.gameManager.getUnitSystem();

    // Jugador 1: esquina superior izquierda (cerca del castillo)
    unitSystem.createUnit(UnitType.Knight, UnitLevel.Basic, 'player1', { x: 1, y: 1 });
    unitSystem.createUnit(UnitType.Knight, UnitLevel.Basic, 'player1', { x: 4, y: 1 });

    // Jugador 2: esquina superior derecha
    unitSystem.createUnit(UnitType.Knight, UnitLevel.Basic, 'player2', { x: 18, y: 1 });
    unitSystem.createUnit(UnitType.Knight, UnitLevel.Basic, 'player2', { x: 15, y: 1 });

    // Jugador 3: esquina inferior izquierda
    unitSystem.createUnit(UnitType.Knight, UnitLevel.Basic, 'player3', { x: 1, y: 18 });
    console.log(`🗺️ Mapa: ${GAME_CONFIG.MAP_WIDTH}x${GAME_CONFIG.MAP_HEIGHT} tiles (4 jugadores)`);

    console.log(`🏰 4 castillos en las esquinas`);
    // Jugador 4: esquina inferior derecha
    unitSystem.createUnit(UnitType.Knight, UnitLevel.Basic, 'player4', { x: 18, y: 18 });
    unitSystem.createUnit(UnitType.Knight, UnitLevel.Basic, 'player4', { x: 15, y: 18 });

    // Configurar controles
    this.setupInput();

    console.log(`📱 Mapa: ${GAME_CONFIG.MAP_WIDTH}x${GAME_CONFIG.MAP_HEIGHT} tiles`);
    console.log(`📐 Tile size: ${GAME_CONFIG.TILE_SIZE}px`);
  }

  private setupInput(): void {
    // ===== CONTROLES DE TECLADO (para desarrollo) =====
    this.input.keyboard.on('press', (evt) => {
      if (evt.key === Keys.Space) {
        this.gameManager.nextPhase();
        console.log(`⏩ Fase: ${this.gameManager.getCurrentPhase()}`);
      }

      if (evt.key === Keys.N) {
        // Saltar turno completo
        for (let i = 0; i < 4; i++) {
          this.gameManager.nextPhase();
        }
      }
    });

    // ===== CONTROLES TÁCTILES (móvil) =====
    let lastTapTime = 0;
    let tapCount = 0;

    this.input.pointers.primary.on('down', (evt) => {
      const worldPos = evt.worldPos;
      const tileX = Math.floor(worldPos.x / GAME_CONFIG.TILE_SIZE);
      const tileY = Math.floor(worldPos.y / GAME_CONFIG.TILE_SIZE);

      // Detectar doble tap para avanzar fase
      const currentTime = Date.now();
      const tapDelay = currentTime - lastTapTime;

      if (tapDelay < 300 && tapDelay > 0) {
        // Doble tap detectado
        tapCount++;
        if (tapCount >= 2) {
          this.gameManager.nextPhase();
          console.log(`⏩ Fase: ${this.gameManager.getCurrentPhase()}`);
          tapCount = 0;
          return;
        }
      } else {
        tapCount = 1;

        // Tap simple - seleccionar unidad o mover
        this.handleTileSelection(tileX, tileY);
      }

      lastTapTime = currentTime;
    });
  }

  private handleTileSelection(tileX: number, tileY: number): void {
    console.log(`👆 Tap en tile: (${tileX}, ${tileY})`);

    const mapSystem = this.gameManager.getMapSystem();
    const unitSystem = this.gameManager.getUnitSystem();
    const currentPlayer = this.gameManager.getCurrentPlayer();

    if (!currentPlayer) return;

    // Si hay una unidad seleccionada, intentar mover
    if (this.selectedUnit) {
      const targetPosition = { x: tileX, y: tileY };

      // Verificar si la casilla es válida para movimiento
      const isValidMove = this.validMovementTiles.some(
        pos => pos.x === tileX && pos.y === tileY
      );

      if (isValidMove) {
        // Intentar mover la unidad
        const moved = unitSystem.moveUnit(this.selectedUnit, targetPosition);

        if (moved) {
          console.log(`✅ Unidad movida a (${tileX}, ${tileY})`);
        }
      }

      // Deseleccionar y limpiar highlights
      this.clearSelection();
      return;
    }

    // Buscar unidad en la casilla seleccionada
    const unitsAtTile = unitSystem.getUnitsAtPosition({ x: tileX, y: tileY });
    const playerUnits = unitsAtTile.filter(
      unit => unit.getData().playerId === currentPlayer.id
    );

    if (playerUnits.length > 0) {
      const unit = playerUnits[0];
      const unitData = unit.getData();

      // Solo permitir seleccionar si no se ha movido
      if (!unitData.hasMoved) {
        this.selectedUnit = unit;
        unit.setSelected(true);

        // Obtener y resaltar casillas válidas para movimiento
        this.validMovementTiles = unitSystem.getValidMovementTiles(unit);

        console.log(`🎯 Unidad seleccionada (Nivel ${unitData.level})`);
        console.log(`📍 Puede moverse a ${this.validMovementTiles.length} casillas`);

        // Resaltar casillas válidas
        this.validMovementTiles.forEach(pos => {
          const tile = mapSystem.getTileAt(pos.x, pos.y);
          if (tile) {
            tile.setHighlight(true);
          }
        });
      } else {
        console.log('⚠️ Esta unidad ya se movió este turno');
      }
    } else {
      // Feedback visual en casilla vacía
      const tile = mapSystem.getTileAt(tileX, tileY);
      if (tile) {
        tile.setHighlight(true);
        setTimeout(() => tile.setHighlight(false), 200);
      }
    }
  }

  private clearSelection(): void {
    if (this.selectedUnit) {
      this.selectedUnit.setSelected(false);
      this.selectedUnit = null;
    }

    // Limpiar highlights de casillas válidas
    const mapSystem = this.gameManager.getMapSystem();
    this.validMovementTiles.forEach(pos => {
      const tile = mapSystem.getTileAt(pos.x, pos.y);
      if (tile) {
        tile.setHighlight(false);
      }
    });
    this.validMovementTiles = [];
  }

  override onPreUpdate(engine: Engine, elapsedMs: number): void {
    // Lógica de actualización si es necesaria
  }
}

// Exportar también como MyLevel para compatibilidad
export class MyLevel extends GameLevel {}

