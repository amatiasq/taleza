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
  readonly layer: number;
  readonly row: number;
  readonly col: number;
}

export function getDistance(nodeA: INode, nodeB: INode) {
  const x = Math.abs(nodeA.col - nodeB.col);
  const y = Math.abs(nodeA.row - nodeB.row);
  const z = Math.abs(nodeA.layer - nodeB.layer);

  const layerMovement = x > y ?
    DIAGONAL_MOVEMENT_COST * 10 * y + 10 * (x - y) :
    DIAGONAL_MOVEMENT_COST * 10 * x + 10 * (y - x);

  return layerMovement + z * LAYER_CHANGE_COST;

}
