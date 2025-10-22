import { Scene } from 'excalibur';
import { GameState, GamePhase, PlayerData } from '../types';
import { GAME_CONFIG } from '../config';
import { MapSystem } from './MapSystem';
import { UnitSystem } from './UnitSystem';
import { ChurchSystem } from './ChurchSystem';
import { PlayerSystem } from './PlayerSystem';

export class GameManager {
  private gameState: GameState;
  private scene: Scene;
  private mapSystem: MapSystem;
  private unitSystem: UnitSystem;
  private churchSystem: ChurchSystem;
  private playerSystem: PlayerSystem;

  constructor(scene: Scene) {
    this.scene = scene;
    this.mapSystem = new MapSystem(scene);
    this.unitSystem = new UnitSystem(scene);
    this.churchSystem = new ChurchSystem(scene);
    this.playerSystem = new PlayerSystem();

    this.gameState = {
      currentTurn: 1,
      maxTurns: GAME_CONFIG.MAX_TURNS,
      currentPlayerId: '',
      players: new Map(),
      tiles: new Map(),
      churches: new Map(),
      units: new Map(),
      phase: GamePhase.Economic
    };
  }

  public initialize(): void {
    // Crear 4 jugadores
    const player1 = this.playerSystem.createPlayer('player1', 'Jugador 1', '#FF0000');
    const player2 = this.playerSystem.createPlayer('player2', 'Jugador 2', '#0000FF');
    const player3 = this.playerSystem.createPlayer('player3', 'Jugador 3', '#00FF00');
    const player4 = this.playerSystem.createPlayer('player4', 'Jugador 4', '#FFFF00');

    this.gameState.currentPlayerId = player1.id;

    // Inicializar mapa
    this.mapSystem.initialize();

    // Inicializar iglesias
    this.churchSystem.initialize(this.mapSystem);

    console.log('Juego inicializado');
    console.log(`Turno ${this.gameState.currentTurn}/${this.gameState.maxTurns}`);
    console.log(`Fase: ${this.gameState.phase}`);
  }

  public nextPhase(): void {
    const phases = [
      GamePhase.Economic,
      GamePhase.Movement,
      GamePhase.Influence,
      GamePhase.Maintenance
    ];

    const currentIndex = phases.indexOf(this.gameState.phase);
    const nextIndex = (currentIndex + 1) % phases.length;
    this.gameState.phase = phases[nextIndex];

    // Si volvemos a la fase económica, es un nuevo turno
    if (this.gameState.phase === GamePhase.Economic) {
      this.nextTurn();
    } else {
      this.executePhase();
    }
  }

  private executePhase(): void {
    console.log(`Ejecutando fase: ${this.gameState.phase}`);

    switch (this.gameState.phase) {
      case GamePhase.Economic:
        this.executeEconomicPhase();
        break;
      case GamePhase.Movement:
        this.executeMovementPhase();
        break;
      case GamePhase.Influence:
        this.executeInfluencePhase();
        break;
      case GamePhase.Maintenance:
        this.executeMaintenancePhase();
        break;
    }
  }

  private executeEconomicPhase(): void {
    // Recaudar diezmos de todas las iglesias
    const currentPlayer = this.playerSystem.getPlayer(this.gameState.currentPlayerId);
    if (!currentPlayer) return;

    const income = this.churchSystem.collectTithes(currentPlayer.id);
    this.playerSystem.addGold(currentPlayer.id, income);

    console.log(`Jugador ${currentPlayer.name} recaudó ${income} de oro`);
  }

  private executeMovementPhase(): void {
    // Resetear unidades del jugador actual
    this.unitSystem.resetAllUnitsForTurn(this.gameState.currentPlayerId);
  }

  private executeInfluencePhase(): void {
    // Expandir influencia de fe desde iglesias y obispos
    this.churchSystem.expandFaithInfluence(this.mapSystem);
  }

  private executeMaintenancePhase(): void {
    // Curar unidades, actualizar moral, etc.
    this.churchSystem.growAllFollowers(this.mapSystem);
  }

  private nextTurn(): void {
    this.gameState.currentTurn++;

    if (this.gameState.currentTurn > this.gameState.maxTurns) {
      this.endGame();
      return;
    }

    // Cambiar al siguiente jugador
    const players = this.playerSystem.getAllPlayers();
    const currentIndex = players.findIndex(p => p.id === this.gameState.currentPlayerId);
    const nextIndex = (currentIndex + 1) % players.length;
    this.gameState.currentPlayerId = players[nextIndex].id;

    console.log(`\n=== Turno ${this.gameState.currentTurn}/${this.gameState.maxTurns} ===`);
    console.log(`Jugador activo: ${players[nextIndex].name}`);
  }

  private endGame(): void {
    console.log('¡Juego terminado!');
    // Calcular victorias
  }

  public getMapSystem(): MapSystem {
    return this.mapSystem;
  }

  public getUnitSystem(): UnitSystem {
    return this.unitSystem;
  }

  public getChurchSystem(): ChurchSystem {
    return this.churchSystem;
  }

  public getPlayerSystem(): PlayerSystem {
    return this.playerSystem;
  }

  public getCurrentPlayer(): PlayerData | null {
    return this.playerSystem.getPlayer(this.gameState.currentPlayerId);
  }

  public getCurrentPhase(): GamePhase {
    return this.gameState.phase;
  }

  public getCurrentTurn(): number {
    return this.gameState.currentTurn;
  }
}

