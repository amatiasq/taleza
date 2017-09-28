import { range } from '../utils';


export default class Layer<T> {
  protected data: T[][];
  public view: any;


  constructor(
    public readonly index: number,
    public readonly rows: number,
    public readonly cols: number,
    create: CellCreator<T>,
  ) {
    this.data = [];

    for (const i of range(rows)) {
      this.data[i] = [];

      for (const j of range(cols))
        this.data[i][j] = create(index, i, j);
    }
  }


  getNeighbors(row: number, col: number): T[] {
    const result = [];

    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0)
          continue;

        const cell = this.get(i + row, j + col);
        if (cell)
          result.push(cell);
      }
    }

    return result;
  }

  get(row: number, col: number): T {
    const entry = this.data[row];
    return entry ? entry[col] : null;
  }

  forEach(iterator: LayerIterator<T>): void {
    const { rows, cols } = this;

    for (let i = 0; i < rows; i++)
      for (let j = 0; j < cols; j++)
        iterator(this.data[i][j], i, j, this);
  }
}


export type CellCreator<T> = (layer: number, row: number, col: number) => T;
export type LayerIterator<T> = (cell: T, row: number, col: number, layer: Layer<T>) => void;