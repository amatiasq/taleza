import Cell from '../game/cell';
import Layer from '../map/layer';
import CellView from './cell-view';

export default class LayerView {
  public x = 0;
  public y = 0;
  public width = 0;
  public height = 0;


  constructor(
    public game: Game,
    protected layer: Layer<Cell>,
    public size: number,
  ) {
    layer.forEach((cell, row, col) => {
      cell.view = new CellView(game, cell, size);
    });

    this.refresh();
  }


  refresh(): void {
    const { width, height, x, y } = this;
    this.width = this.layer.cols * this.size;
    this.height = this.layer.rows * this.size;
    this.x = this.width * this.layer.index + this.size;
    this.y = this.height * this.layer.index + this.size;

    // grid display
    const layerRows = 3;

    this.x = (this.width + this.size) * (this.layer.index % layerRows);
    this.y = (this.height + this.size) * Math.floor(this.layer.index / layerRows);

    if (
      this.width !== width ||
      this.height !== height ||
      this.x !== x ||
      this.y !== y
    ) {
      this.redraw();
    }
  }

  redraw(): void {
    this.layer.forEach((cell, row, col) => {
      cell.view.x = cell.view.text.x = this.x + col * this.size;
      cell.view.y = cell.view.text.y = this.y + row * this.size;
    });
  }
}
