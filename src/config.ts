// Configuración del juego y constantes

import { TerrainType, TerrainModifiers } from './types';

// Configuración para 4 jugadores
export const GAME_CONFIG = {
  TILE_SIZE: 64, // Tamaño de cada tile (64x64px para las imágenes)
  MAP_WIDTH: 20, // Mapa más grande para 4 jugadores (1280px de ancho)
  MAP_HEIGHT: 20, // Mapa cuadrado (1280px de alto)
  MAX_TURNS: 50,
  INITIAL_GOLD: 100,
  INITIAL_FAITH: 0,
  UNIT_RECRUIT_COST: 20,
  BISHOP_RECRUIT_COST: 50,
  FAITH_INFLUENCE_RADIUS: 2,
  BISHOP_INFLUENCE_RADIUS: 3,
  ELITE_UNIT_INFLUENCE_BONUS: 1
};

// Modificadores de terreno (solo tipos utilizados)
export const TERRAIN_MODIFIERS: Record<TerrainType, TerrainModifiers> = {
  [TerrainType.Plain]: {
    movement: 1.0,
    defense: 1.0,
    attack: 1.0,
    rangeBonus: 0
  },
  [TerrainType.Forest]: {
    movement: 1.5,
    defense: 1.25,
    attack: 0.9,
    rangeBonus: 0,
    special: 'Mayor defensa, reduce visibilidad'
  },
  [TerrainType.Mountain]: {
    movement: 2.0,
    defense: 1.5,
    attack: 1.0,
    rangeBonus: 1,
    special: 'Solo unidades ligeras'
  },
  [TerrainType.Church]: {
    movement: 1.0,
    defense: 1.5,
    attack: 1.0,
    rangeBonus: 0,
    special: 'Expansión de fe +25%, genera feligreses'
  },
  [TerrainType.Castle]: {
    movement: 1.0,
    defense: 2.0,
    attack: 1.0,
    rangeBonus: 1,
    special: 'Base del jugador'
  }
};

// Constantes para el sistema de diezmos
export const TITHE_CONFIG = {
  MIN_TITHE_RATE: 0.05,
  MAX_TITHE_RATE: 0.5,
  DEFAULT_TITHE_RATE: 0.1,
  FOLLOWER_GROWTH_CONSTANT: 0.15,
  INITIAL_FOLLOWERS: 50
};

