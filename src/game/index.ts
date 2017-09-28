import GameMap from './map';


export default class TalezaGame {

  private map: GameMap;


  constructor(canvas: HTMLCanvasElement) {}


  setMapSize(width: number, height: number, tileSize: number) {
    this.map = new GameMap<Cell>(6, 11, 11, (layer, row, col) => new Cell(layer, row, col));
    this.map = new GameMap(width, height, tileSize);
  }


  start() {

  }
}
