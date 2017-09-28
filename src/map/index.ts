import {
  getDistance,
  range,
} from '../utils';
import Layer, { CellCreator } from './layer';


export default class GameMap<T extends ICell> {
  public layers: Layer<T>[];
  public view: any;


  constructor(
    public readonly layersCount: number,
    public readonly rows: number,
    public readonly cols: number,
    creator: CellCreator<T>,
  ) {
    this.layers = [];

    for (const i of range(layersCount))
      this.layers[i] = new Layer(i, rows, cols, creator);
  }


  get(layerIndex: number, row: number, col: number): T {
    const layer = this.layers[layerIndex];
    return layer ? layer.get(row, col) : null;
  }

  forEach(iterator: MapIterator<T>): void {
    const { layersCount, rows, cols } = this;

    for (let i = 0; i < layersCount; i++)
      for (let j = 0; j < rows; j++)
        for (let k = 0; k < cols; k++)
          iterator(this.layers[i].get(j, k), i, j, k, this);
  }

  addEntity(entity: IEntity<T>, location: T): void {
    entity.location = location;
    location.entities.add(entity);
  }

  moveEntity(entity: IEntity<T>, target: T): void {
    entity.location.entities.delete(entity);
    this.addEntity(entity, target);
  }

  checkEntity(entity: IEntity<T>): boolean {
    const cell = entity.location;
    const closest = this.fallbackCell(cell);

    if (cell === closest)
      return false;

    if (!closest)
      throw new Error(`Cell {z:${cell.layer},x:${cell.row},y:${cell.col}} has no fallback neighbor`);

    this.moveEntity(entity, closest);
    return true;
  }

  getAbove(cell: T): T {
    return this.get(cell.layer + 1, cell.row, cell.col);
  }

  getBelow(cell: T): T {
    return this.get(cell.layer - 1, cell.row, cell.col);
  }

  getNeighbors(cell: T): T[] {
    const { row, col, layer: layerIndex } = cell;
    const layer = this.layers[layerIndex];
    const result = layer.getNeighbors(row, col);

    if (cell.isEmpty) {
      const below = this.getBelow(cell);
      const layerBelow = this.layers[below.layer];

      if (below && below.hasRamp)
        result.push(...layerBelow.getNeighbors(row, col));
    }

    if (cell.hasRamp) {
      const above = this.getAbove(cell);
      const layerAbove = this.layers[above.layer];

      if (above && above.isEmpty)
        result.push(...layerAbove.getNeighbors(row, col));
    }

    return result;
  }

  private fallbackCell(cell: T): T {
    if (cell.canStand)
      return cell;

    const neighbors = this.getNeighbors(cell);
    let value = Infinity;
    let closest: T = null;

    neighbors.forEach(entry => {
      if (!entry.canStand)
        return;

      const newValue = getDistance(cell, entry);
      if (newValue < value) {
        value = newValue;
        closest = entry;
      }
    });

    if (!closest)
      closest = this.get(cell.layer - 1, cell.row, cell.col);

    return closest;
  }
}


export interface IEntity<T extends ICell> {
  location: T;
}


export interface ICell {
  layer: number;
  row: number;
  col: number;
  entities: Set<IEntity<ICell>>;
  canStand: boolean;
  isEmpty: boolean;
  hasRamp: boolean;
}


export type MapIterator<T extends ICell> = (cell: T, layer: number, row: number, col: number, map: GameMap<T>) => void;
