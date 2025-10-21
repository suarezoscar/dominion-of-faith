import { ImageSource, Loader } from "excalibur";

// Recursos del juego - Tiles
export const Resources = {
  // Tiles
  Castle1: new ImageSource("./images/tiles/castle-1.png"),
  Castle2: new ImageSource("./images/tiles/castle-2.png"),
  Church1: new ImageSource("./images/tiles/church-1.png"),
  Forest1: new ImageSource("./images/tiles/forest-1.png"),
  Forest2: new ImageSource("./images/tiles/forest-2.png"),
  Forest3: new ImageSource("./images/tiles/forest-3.png"),
  Forest4: new ImageSource("./images/tiles/forest-4.png"),
  Mountain1: new ImageSource("./images/tiles/mountain-1.png"),
  Mountain2: new ImageSource("./images/tiles/mountain-2.png"),
  Plain1: new ImageSource("./images/tiles/plain-1.png"),
  Plain2: new ImageSource("./images/tiles/plain-2.png"),

  // Units
  Bishop1: new ImageSource("./images/units/bishop-1.png"),
  Knight1: new ImageSource("./images/units/knight-1.png"),
  Knight2: new ImageSource("./images/units/knight-2.png"),
  Knight3: new ImageSource("./images/units/knight-3.png"),

  // Otros
  Sword: new ImageSource("./images/sword.png")
} as const;

// Construir el loader y agregar todos los recursos
export const loader = new Loader();
for (const res of Object.values(Resources)) {
  loader.addResource(res);
}
