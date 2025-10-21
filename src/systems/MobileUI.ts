# 📱 UI System para Dominion of Faith (Móvil)

import { ScreenElement, Color, Vector, Font, Text, Label, Actor, vec } from 'excalibur';
import { GameManager } from './GameManager';
import { GAME_CONFIG } from '../config';

export class MobileUI {
  private gameManager: GameManager;
  private turnLabel!: Label;
  private phaseLabel!: Label;
  private goldLabel!: Label;
  private faithLabel!: Label;

  constructor(gameManager: GameManager) {
    this.gameManager = gameManager;
  }

  public initialize(scene: any): void {
    // Panel superior con información del turno
    this.createTopPanel(scene);

    // Botón de fase siguiente (esquina inferior derecha)
    this.createNextPhaseButton(scene);
  }

  private createTopPanel(scene: any): void {
    const panelHeight = 60;
    const fontSize = 14;

    // Turno actual
    this.turnLabel = new Label({
      text: 'Turno: 1/50',
      pos: vec(10, 10),
      font: new Font({
        size: fontSize,
        color: Color.White,
        bold: true
      })
    });

    // Fase actual
    this.phaseLabel = new Label({
      text: 'Fase: Economic',
      pos: vec(10, 30),
      font: new Font({
        size: fontSize,
        color: Color.Yellow
      })
    });

    // Oro
    this.goldLabel = new Label({
      text: '💰 100',
      pos: vec(GAME_CONFIG.MAP_WIDTH * GAME_CONFIG.TILE_SIZE - 100, 10),
      font: new Font({
        size: fontSize,
        color: Color.fromHex('#FFD700'),
        bold: true
      })
    });

    // Fe
    this.faithLabel = new Label({
      text: '✝️ 0',
      pos: vec(GAME_CONFIG.MAP_WIDTH * GAME_CONFIG.TILE_SIZE - 100, 30),
      font: new Font({
        size: fontSize,
        color: Color.fromHex('#87CEEB')
      })
    });

    scene.add(this.turnLabel);
    scene.add(this.phaseLabel);
    scene.add(this.goldLabel);
    scene.add(this.faithLabel);
  }

  private createNextPhaseButton(scene: any): void {
    // Botón táctil para avanzar fase
    const buttonSize = 60;
    const buttonX = GAME_CONFIG.MAP_WIDTH * GAME_CONFIG.TILE_SIZE - buttonSize - 10;
    const buttonY = GAME_CONFIG.MAP_HEIGHT * GAME_CONFIG.TILE_SIZE - buttonSize - 10;

    const button = new Actor({
      pos: vec(buttonX, buttonY),
      width: buttonSize,
      height: buttonSize,
      color: Color.fromHex('#4CAF50'),
      z: 100
    });

    // Agregar texto al botón
    const buttonText = new Label({
      text: '▶',
      pos: vec(buttonX + 15, buttonY + 10),
      font: new Font({
        size: 32,
        color: Color.White,
        bold: true
      }),
      z: 101
    });

    // Hacer el botón interactivo
    button.on('pointerdown', () => {
      this.gameManager.nextPhase();
      this.update();
    });

    scene.add(button);
    scene.add(buttonText);
  }

  public update(): void {
    const currentPlayer = this.gameManager.getCurrentPlayer();
    const currentTurn = this.gameManager.getCurrentTurn();
    const currentPhase = this.gameManager.getCurrentPhase();

    if (this.turnLabel) {
      this.turnLabel.text = `Turno: ${currentTurn}/${GAME_CONFIG.MAX_TURNS}`;
    }

    if (this.phaseLabel) {
      this.phaseLabel.text = `Fase: ${currentPhase}`;
    }

    if (currentPlayer && this.goldLabel) {
      this.goldLabel.text = `💰 ${currentPlayer.gold}`;
    }

    if (currentPlayer && this.faithLabel) {
      this.faithLabel.text = `✝️ ${currentPlayer.faith}`;
    }
  }
}

