import Vector3D from 'amq-tools/vector3d';
import {
  DIAGONAL_MOVEMENT_COST,
  LAYER_CHANGE_COST,
} from './constants';

export function* range(start: number, end = start, step = 1) {
  if (arguments.length === 1)
    start = 0;

  for (let i = start; i < end; i += step)
      yield i;
}


export interface INode {
  readonly location: Vector3D;
}

export function getDistance(nodeA: INode, nodeB: INode) {
  const { x, y, z } = nodeA.location
    .sustract(nodeB.location)
    .map(Math.abs);

  const layerMovement = x > y ?
    DIAGONAL_MOVEMENT_COST * 10 * y + 10 * (x - y) :
    DIAGONAL_MOVEMENT_COST * 10 * x + 10 * (y - x);

  return layerMovement + z * LAYER_CHANGE_COST;
}
