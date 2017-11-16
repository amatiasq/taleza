import Vector3D from 'amq-tools/vector3d';

export interface INode {
  location: Vector3D;
  isEmpty?: boolean;
  isObstacle?: boolean;
  canTravelUp?: boolean;
}
