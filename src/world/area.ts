import { VectorMatrix } from 'amq-tools/matrix';
import Vector3D from 'amq-tools/vector3d';
import { INode } from './node';

export default class Area<T extends INode> {
  private tiles: VectorMatrix<T, Vector3D>;


  constructor(data: VectorMatrix<T, Vector3D>);
  constructor(size: Vector3D, creator: NodeCreator<T>);
  constructor(_: VectorMatrix<T, Vector3D> | Vector3D, creator?: NodeCreator<T>) {
    if (_ instanceof VectorMatrix) {
      this.tiles = _;
      return;
    }

    const size = _;
    this.tiles = new VectorMatrix([] as T[], size);

    for (const index of Vector3D.iterate(size))
      this.tiles.setVector(creator(index), index);
  }


  get size() {
    return this.tiles.size;
  }


  private get offset() {
    return this.tiles.get(0, 0, 0).location;
  }


  get(location: Vector3D): T {
    return this.tiles.getVector(location);
  }


  getNodeFor(entity: IEntity<T>) {
    return this.get(entity.location);
  }


  contains(node: INode) {
    const { offset, size } = this;
    const max = size.add(offset);
    return node.location.every((coord, key) => offset[key] <= coord && coord < max[key]);
  }


  getRange(offset: Vector3D, size: Vector3D = this.size.sustract(offset)): Area<T> {
    const maxSize = this.size.sustract(offset);
    const finalSize = Vector3D.map(Math.min, maxSize, size);
    const data = [] as T[];

    for (const location of Vector3D.iterate(offset, finalSize.add(offset)))
      data.push(this.get(location));

    const matrix = new VectorMatrix(data, finalSize);
    return new Area(matrix);
  }


  areNeighbors(nodeA: T, nodeB: T): boolean {
    if (!nodeA || !nodeB || nodeA === nodeB || nodeA.isObstacle || nodeB.isObstacle)
      return false;

    const distance = nodeA.location.sustract(nodeB.location).map(Math.abs);

    if (distance.z > 1 || distance.y > 1 || distance.x > 1)
      return false;

    if (distance.z === 0)
      return true;

    // Here `distance.z` is 1
    const below = nodeA.location.z < nodeB.location.z ? nodeA : nodeB;
    const above = this.get(below.location.add({ z: 1 }));
    return Boolean(below.canTravelUp && above.isEmpty);
  }


  getNeighbors(node: T): T[] {
    if (node.isObstacle || !this.contains(node))
      return [];

    const layerNeighbors = this.getLayerNeighbors(node);

    const neighbors = layerNeighbors.map(neighbor => {
      if (!neighbor.isEmpty)
        return neighbor;

      const locationBelow = neighbor.location.sustract({ z: 1 });
      const below = this.get(locationBelow);
      return below.canTravelUp ? below : null;
    }).filter(Boolean);

    if (node.canTravelUp) {
      const locationAbove = node.location.add({ z: 1 });
      const above = this.get(locationAbove);

      if (above && above.isEmpty)
        neighbors.push(...this.getLayerNeighbors(above));
    }

    return neighbors;
  }


  private getLayerNeighbors(node: T): T[] {
    const neighbors = [];
    const location = node.location.sustract(this.offset);

    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) continue;

        const neighborLocation = location.add({ x: i, y: j });
        if (neighborLocation.some(coord => coord < 0))
          continue;

        const neighbor = this.get(neighborLocation);

        if (neighbor && !neighbor.isObstacle)
          neighbors.push(neighbor);
      }
    }

    return neighbors;
  }


  toArray() {
    return this.tiles.toArray();
  }
}


export type NodeCreator<T> = (location: Vector3D) => T;
