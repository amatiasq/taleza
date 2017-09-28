import Cell from '../game/cell';

export default class CellView {
  public color: string;
  public highlight: boolean;
  protected text: Text;


  constructor(
    protected cell: Cell,
    public size: number,
  ) {
    this.x = cell.x * size;
    this.y = cell.y * size;
  }


  render(context: CanvasRenderingContext2D) {
    context.save();
    context.fillStyle = this.getColor();
    context.fillRect(this.cell.position.x, this.cell.position.y, this.size, this.size);
    context.restore();
  }


  private getColor(): string {
    if (this.color)
      return this.color;

    if (this.highlight)
      return 'red';

    if (this.cell.content)
      return this.cell.content.color.toString(16);

    if (this.cell.floor)
      return this.cell.floor.color.toString(16);

    return 'white';
  }
}
