import Vector3D from 'amq-tools/vector3d';
import { CLOSER_MODIFIER } from '../constants';
import { IPathfindingNode } from '../pathfinding/a-star';
import { IEntity, INode } from '../world';
import Material from '../world/material';

export default class Cell implements INode, IPathfindingNode {
  // Interface fulfillment
  public gCost: number;
  public hCost: number;
  public parentNode: Cell;
  public view: any;

  public weight: number;
  public floor: Material;
  public content: Material;
  public ground: CellGround;
  public readonly entities = new Set<IEntity<Cell>>();


  constructor(public readonly location: Vector3D) {}


  get isObstacle(): boolean {
    return this.weight === 0;
  }

  get canStand(): boolean {
    return this.floor && !this.content;
  }

  get isEmpty(): boolean {
    return !this.floor && !this.content;
  }

  get hasRamp(): boolean {
    return this.ground && this.ground.isRamp;
  }

  get fCost(): number {
    return this.gCost + this.hCost * CLOSER_MODIFIER;
  }


  toString(): string {
    return `Cell(${this.location})`;
  }
}


interface CellGround {
  isRamp: boolean;
}