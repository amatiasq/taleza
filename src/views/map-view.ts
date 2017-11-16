import Game from '../game';
import Cell from '../game/cell';
import GameMap from '../map';
import LayerView from './layer-view';


export default class MapView {
  constructor(
    public game: Game,
    protected map: GameMap<Cell>,
    public size: number,
  ) {
    for (const layer of map.layers)
      layer.view = new LayerView(this.game, layer, size);

    this.map.forEach((cell) => game.add.existing(cell.view));
  }
}
