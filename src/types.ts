// Tipos y enums principales del juego

export enum TerrainType {
  Plain = 'plain',
  Forest = 'forest',
  Mountain = 'mountain',
  Church = 'church',
  Castle = 'castle'
}

export enum UnitType {
  Knight = 'knight',
  Bishop = 'bishop'
}

export enum UnitLevel {
  Basic = 1,
  Veteran = 2,
  Elite = 3
}

export interface TerrainModifiers {
  movement: number;
  defense: number;
  attack: number;
  rangeBonus: number;
  special?: string;
}

export interface Position {
  x: number;
  y: number;
}

export interface UnitData {
  id: string;
  type: UnitType;
  level: UnitLevel;
  playerId: string;
  position: Position;
  movement: number;
  maxMovement: number;
  health: number;
  maxHealth: number;
  hasMoved: boolean;
  hasAttacked: boolean;
}

export interface ChurchData {
  id: string;
  position: Position;
  playerId: string | null;
  followers: number; // Feligreses
  titheRate: number; // Porcentaje de diezmo (0-1)
  connected: boolean; // Conectado al obispado
  faithInfluenceRadius: number;
}

export interface BishopData extends UnitData {
  type: UnitType.Bishop;
  faithInfluenceRadius: number;
  canPreach: boolean;
}

export interface PlayerData {
  id: string;
  name: string;
  color: string;
  gold: number;
  faith: number;
  territoryControlled: number;
  isActive: boolean;
}

export interface TileData {
  position: Position;
  terrain: TerrainType;
  playerId: string | null; // Influencia de fe
  faithStrength: number; // 0-100
  units: UnitData[];
  church?: ChurchData;
}

export interface GameState {
  currentTurn: number;
  maxTurns: number;
  currentPlayerId: string;
  players: Map<string, PlayerData>;
  tiles: Map<string, TileData>;
  churches: Map<string, ChurchData>;
  units: Map<string, UnitData>;
  phase: GamePhase;
}

export enum GamePhase {
  Economic = 'economic',
  Movement = 'movement',
  Influence = 'influence',
  Maintenance = 'maintenance'
}

