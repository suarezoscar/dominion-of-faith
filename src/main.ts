import { Color, DisplayMode, Engine, FadeInOut } from "excalibur";
import { loader } from "./resources";
import { GameLevel } from "./level";

// Goal is to keep main.ts small and just enough to configure the engine

const game = new Engine({
  width: 1280, // Ancho ajustado para el mapa del juego
  height: 960, // Alto ajustado para el mapa del juego
  displayMode: DisplayMode.FitScreenAndFill,
  pixelArt: true,
  scenes: {
    start: GameLevel
  },
  backgroundColor: Color.fromHex('#1a1a1a')
});

game.start('start', {
  loader,
  inTransition: new FadeInOut({
    duration: 500,
    direction: 'in',
    color: Color.Black
  })
}).then(() => {
  console.log('Dominion of Faith iniciado correctamente');
});