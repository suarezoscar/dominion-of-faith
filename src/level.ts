import { Scene, Engine, Keys } from 'excalibur';
import { GameManager } from './systems/GameManager';
import { UnitType, UnitLevel } from './types';

export class GameLevel extends Scene {
  private gameManager!: GameManager;
  private selectedUnit: any = null;

  override onInitialize(engine: Engine): void {
    console.log('Inicializando nivel de juego...');

    this.gameManager = new GameManager(this);
    this.gameManager.initialize();

    // Crear algunas unidades de prueba
    const unitSystem = this.gameManager.getUnitSystem();

    // Unidades para jugador 1
    unitSystem.createUnit(UnitType.Knight, UnitLevel.Basic, 'player1', { x: 2, y: 2 });
    unitSystem.createUnit(UnitType.Knight, UnitLevel.Basic, 'player1', { x: 3, y: 2 });

    // Unidades para jugador 2
    unitSystem.createUnit(UnitType.Knight, UnitLevel.Basic, 'player2', { x: 17, y: 12 });

    // Configurar controles
    this.setupInput();
  }

  private setupInput(): void {
    // Tecla ESPACIO para avanzar de fase
    this.input.keyboard.on('press', (evt) => {
      if (evt.key === Keys.Space) {
        this.gameManager.nextPhase();
        console.log(`Fase actual: ${this.gameManager.getCurrentPhase()}`);
      }

      // Tecla N para siguiente turno (debug)
      if (evt.key === Keys.N) {
        this.gameManager.nextPhase();
        this.gameManager.nextPhase();
        this.gameManager.nextPhase();
        this.gameManager.nextPhase();
      }
    });

    // Click en el mapa
    this.input.pointers.primary.on('down', (evt) => {
      const worldPos = evt.worldPos;
      console.log(`Click en: ${worldPos.x}, ${worldPos.y}`);
    });
  }

  override onPreUpdate(engine: Engine, elapsedMs: number): void {
    // Lógica de actualización aquí si es necesaria
  }
}

// Exportar también como MyLevel para compatibilidad
export class MyLevel extends GameLevel {}
