import { Color, DisplayMode, Engine, FadeInOut } from "excalibur";
import { loader } from "./resources";
import { GameLevel } from "./level";

// Configuración optimizada para móvil
const game = new Engine({
  width: 768, // 12 tiles × 64px
  height: 640, // 10 tiles × 64px
  displayMode: DisplayMode.FitScreen, // Se ajusta a la pantalla manteniendo aspect ratio
  pixelArt: true,
  pixelRatio: 2, // Para pantallas retina/alta densidad
  scenes: {
    start: GameLevel
  },
  backgroundColor: Color.fromHex('#1a1a1a'),
  suppressPlayButton: true // Evita el botón de play en móvil
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
  console.log(`Resolución: ${game.screen.resolution.width}x${game.screen.resolution.height}`);
});