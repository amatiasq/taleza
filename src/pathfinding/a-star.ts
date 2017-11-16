import {
  DIAGONAL_MOVEMENT_COST,
  LAYER_CHANGE_COST,
} from '../constants';
import {
  getDistance,
  INode,
} from '../utils';

export default class AStar<T extends IPathfindingNode> {

  constructor(
    public map: IPathfindingMap<T>,
    public paint: (cell: T, color: number) => void
  ) {}


  calculate(start: T, end: T): T[] {
    const before = performance.now();
    const result = this.calculateInternal(start, end);
    const after = performance.now();
    AStar.log(after - before, result && result.length);
    return result;
  }

  private calculateInternal(start: T, end: T): T[] {
    const open = new Set<T>();
    const closed = new Set<T>();

    let current: T;
    open.add(start);

    while (open.size) {
      current = this.getNext(open, closed);

      if (current === end)
        return this.retrace(start, end);

      if (current.isEmpty && !this.hasRampBelow(current))
        continue;

      const neighbors = this.map.getNeighbors(current);

      for (const neighbor of neighbors)
        if (this.parseNeighbor(neighbor, current, start, end, open, closed))
          open.add(neighbor);
    }
  }

  *debug(start: T, end: T, {
    visited = 0x777777,
    neighbor: neighborColor = 0x0000FF,
    active = 0xFF00FF,
  } = {}): IterableIterator<T> {
    const open = new Set<T>();
    const closed = new Set<T>();
    let current: T;

    open.add(start);
    this.paint(start, neighborColor);

    while (open.size) {
      if (current)
        this.paint(current, visited);

      current = this.getNext(open, closed);
      this.paint(current, active);

      if (current === end)
        return this.retrace(start, end);

      if (current.isEmpty && !this.hasRampBelow(current))
        continue;

      const neighbors = this.map.getNeighbors(current);

      for (const neighbor of neighbors) {
        if (this.parseNeighbor(neighbor, current, start, end, open, closed)) {
          open.add(neighbor);
          this.paint(neighbor, neighborColor);
        }
      }

      yield;
    }
  }


  /*
   * Shared code
   */

  parseNeighbor(neighbor: T, current: T, start: T, end: T, open: Set<T>, closed: Set<T>): boolean {
    if (neighbor.isObstacle || closed.has(neighbor))
      return false;

    const movement = (current.gCost || 0) + this.getDistance(current, neighbor);

    if (movement < neighbor.gCost || !open.has(neighbor)) {
      neighbor.gCost = movement;
      neighbor.hCost = this.getDistance(neighbor, end);
      neighbor.parentNode = current;
      return !open.has(neighbor);
    }
  }

  hasRampBelow(cell: T): boolean {
    const below = this.map.getBelow(cell);
    return below && below.hasRamp;
  }


  /*
   * Helpers
   */

  getDistance(nodeA: T, nodeB: T): number {
    return getDistance(nodeA, nodeB);
  }

  getNext(open: Set<T>, closed: Set<T>): T {
    let best: T = null;

    for (let item of open) {
      if (!best || (item.fCost < best.fCost || (item.fCost === best.fCost && item.hCost < best.hCost)))
        best = item;
    }

    open.delete(best);
    closed.add(best);
    return best;
  }

  retrace(start: T, end: T): T[] {
    const path = [] as T[];
    let current = end;

    while (current !== start) {
      path.push(current);
      current = current.parentNode as T;
    }

    return path.reverse();
  }


  /*
   * PERFORMANCE
   */
  private static logs = [] as number[];

  private static log(time: number, steps: number) {
    this.logs.push(time);
    const total = this.logs.reduce((sum, current) => sum + current);
    const average = total / this.logs.length;
    console.log(`[A*] ${this.round(time)}ms for ${steps} steps (avg ${this.round(average)}ms)`);
  }
  private static round(value: number) {
    return Math.round(value * 100) / 100;
  }
}



export interface IPathfindingNode extends INode {
  parentNode: IPathfindingNode;
  gCost: number;
  hCost: number;
  readonly fCost: number;

  readonly hasRamp: boolean;
  readonly isEmpty: boolean;
  readonly isObstacle: boolean;
  readonly canStand: boolean;
}


export interface IPathfindingMap<T extends IPathfindingNode> {
  getNeighbors(cell: T): T[];
  getBelow(cell: T): T;
  getAbove(cell: T): T;
}


/*

export default class Pathfainding<T extends IPathfindingNode> {
  private start: T;
  private end: T;
  open: T[];
  closed: T[];
  private current: T;
  private neighbours: T[];
  private neighbourIndex: number;

  constructor(
    private grid: IMap<T>,
    start: T,
    end: T
  ) {
    this.open = [] as T[];
    this.closed = [] as T[];
    this.setOpen(this.start);
  }

  next() {
    return this.neighbours ?
      this.processNeighbour() :
      this.processOpen();
  }

  private processOpen() {
    let best = 0;

    for (let i = 1; i < this.open.length; i++) {
      const bestNode = this.open[best];
      const entry = this.open[i];

      if (entry.fCost < bestNode.fCost || (entry.fCost === bestNode.fCost && entry.hCost < bestNode.hCost))
        best = i;
    }

    if (this.current)
      this.getView(this.current).tint = 0x888888;

    this.current = this.open[best];
    this.setClosed(this.current, best);
    this.getView(this.current).tint = 0x00FFFF;

    if (this.current === this.end)
      return Pathfinding.retrace(this.start, this.end);

    this.neighbours = this.grid.getNeighbors(this.current);
    this.neighbourIndex = 0;

    while (this.neighbours)
      this.processNeighbour();
  }

  private processNeighbour() {
    const neighbour = this.neighbours[ this.neighbourIndex++ ];

    if (this.neighbourIndex >= this.neighbours.length)
      this.neighbours = null;

    if (neighbour.isObstacle || this.closed.indexOf(neighbour) !== -1)
      return;

    const movement = this.current.gCost + Pathfinding.getDistance(this.current, neighbour);
    if (movement < neighbour.gCost || this.open.indexOf(neighbour) === -1) {
      neighbour.gCost = movement;
      neighbour.hCost = Pathfinding.getDistance(neighbour, this.end);
      neighbour.parentNode = this.current;

      if (this.open.indexOf(neighbour) === -1)
        this.setOpen(neighbour);
    }
  }

  private setClosed(node: T, openIndex: number) {
    this.open.splice(openIndex, 1);
    this.closed.push(node);
  }

  private setOpen(node: T) {
    this.open.push(node);
    this.getView(node).tint = 0x00FF00;
  }


  private static getDistance<U extends INode>(nodeA: U, nodeB: U) {
    const x = Math.abs(nodeA.col - nodeB.col);
    const y = Math.abs(nodeA.row - nodeB.row);

    return x > y ?
      DIAGONAL_MOVEMENT_COST * 10 * y + 10 * (x - y) :
      DIAGONAL_MOVEMENT_COST * 10 * x + 10 * (y - x);
  }

  private static retrace<U extends INode>(start: U, end: U) {
    const path: U[] = [];
    let current = end;

    while (current !== start) {
      path.push(current);
      current = current.parentNode as U;
    }

    return path.reverse();
  }

  private getView(node: T): Sprite {
    return (node as any).view as Sprite;
  }
}
*/
